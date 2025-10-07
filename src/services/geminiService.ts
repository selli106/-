import { GoogleGenAI, Type } from "@google/genai";

export interface Book {
  title: string;
  author: string;
  googleBooksLink?: string;
  coverImageUrl?: string;
  volumeId?: string;
}

export interface UnsureDetection extends Book {
  reason: string;
}

export interface ExtractionResult {
  identifiedBooks: Book[];
  unsureDetections: UnsureDetection[];
  rawText: string;
}


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as Base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const extractBookInfoFromImages = async (files: File[], apiKey: string): Promise<ExtractionResult> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const imageParts = await Promise.all(
    files.map(fileToGenerativePart)
  );
  
  const textPart = {
      text: `You are an expert librarian. Analyze the image(s) of bookshelves or book covers. Your goal is to extract book information and all visible text.
      Respond with a single JSON object containing three properties:
      1. 'identifiedBooks': An array of books you are reasonably confident you've identified. A book belongs in this list if:
          - You are more than 90% certain about both the title AND the author, even if the author's name is partially obscured.
          - You are more than 90% certain about the title, but the author is unclear or not visible. In this case, set the author to 'Unknown'.
      2. 'unsureDetections': Use this list for items where you are less than 90% certain about the title, for example, due to blurry text, partial visibility, or other obstructions. Each object should include a 'title', 'author', and a 'reason' for the uncertainty.
      3. 'rawText': A single string containing all the text you can detect from the image, concatenated together.
      If you cannot find any books or text in a category, return an empty array or an empty string for that property.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [...imageParts, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedBooks: {
              type: Type.ARRAY,
              description: "A list of books confidently identified from the image.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "The full title of the book." },
                  author: { type: Type.STRING, description: "The author of the book. If not visible, set to 'Unknown'." }
                },
                required: ["title", "author"]
              }
            },
            unsureDetections: {
              type: Type.ARRAY,
              description: "A list of potential books where identification is uncertain.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "The potential title of the book." },
                  author: { type: Type.STRING, description: "The potential author. Defaults to 'Unknown' if not clear." },
                  reason: { type: Type.STRING, description: "The reason for the uncertainty (e.g., 'Text is blurry')." }
                },
                required: ["title", "author", "reason"]
              }
            },
            rawText: {
              type: Type.STRING,
              description: "A compilation of all raw text detected in the image."
            }
          },
          required: ["identifiedBooks", "unsureDetections", "rawText"]
        },
      },
    });

    const jsonStr = response.text.trim();
    if (!jsonStr) {
      return { identifiedBooks: [], unsureDetections: [], rawText: '' };
    }
    
    const result = JSON.parse(jsonStr);
    return {
        identifiedBooks: result.identifiedBooks || [],
        unsureDetections: result.unsureDetections || [],
        rawText: result.rawText || ''
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let message = "Failed to extract book info from the AI model.";
    if (error instanceof Error && error.message.includes("API key not valid")) {
      message = "Your Gemini API key is not valid. Please check and save it again.";
    }
    throw new Error(message);
  }
};