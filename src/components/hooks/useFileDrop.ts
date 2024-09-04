import React, { useCallback, useState } from 'react';
export default function useFileDrop() {
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (
      event: React.DragEvent<HTMLDivElement>,
      setDroppedFiles: React.Dispatch<React.SetStateAction<File[]>>
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const files = Array.from(event.dataTransfer.files);
      setDroppedFiles(files);
    },
    []
  );

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
