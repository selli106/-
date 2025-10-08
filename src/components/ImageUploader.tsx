import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((newFiles: File[]) => {
    const filteredFiles = newFiles.filter(file => file.type.startsWith('image/'));
    setFiles(filteredFiles);

    const newPreviews = filteredFiles.map(file => URL.createObjectURL(file));
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews(newPreviews);
    
    onFilesChange(filteredFiles);
  }, [onFilesChange, imagePreviews]);

  const handleFilesFromInput = useCallback((fileList: FileList | null) => {
    if (fileList) {
        handleFileChange(Array.from(fileList));
    }
  }, [handleFileChange]);


  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFilesFromInput(e.dataTransfer.files);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesFromInput(e.target.files);
     // Reset the input value to allow uploading the same file again
    if(e.target) e.target.value = '';
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    handleFileChange(newFiles);
  };

  return (
    <div>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-main-accent bg-white/95' : 'border-main-accent hover:border-main-accent'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center justify-center space-y-2 text-app-text">
          <UploadIcon className="w-8 h-8" />
          <p className="font-semibold">Drag & drop your images here</p>
          <p className="text-sm">or click to browse</p>
        </div>
      </div>
      {imagePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 text-lg font-bold leading-none"
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
