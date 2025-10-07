export interface GoogleBookInfo {
  googleBooksLink: string;
  coverImageUrl: string;
  volumeId: string;
}

export const fetchGoogleBookInfo = async (title: string, author: string): Promise<GoogleBookInfo | null> => {
  if (!title) return null;

  const authorQuery = (author && author !== 'Unknown') ? `+inauthor:${encodeURIComponent(author)}` : '';
  const query = `intitle:${encodeURIComponent(title)}${authorQuery}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Google Books API request failed with status: ${response.status}`);
      return null;
    }
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const book = item.volumeInfo;
      const volumeId = item.id;
      const infoLink = book.infoLink;
      const thumbnail = book.imageLinks?.medium || book.imageLinks?.thumbnail || '';

      if (infoLink && volumeId) {
        return { googleBooksLink: infoLink, coverImageUrl: thumbnail, volumeId };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching from Google Books API:", error);
    return null;
  }
};