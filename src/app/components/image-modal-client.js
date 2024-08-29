"use client";
import React, { useEffect, useState } from 'react';

const ImageModalClient = ({ src, alt }) => {
  const [modalSrc, setModalSrc] = useState(null);

  const handleImageClick = () => {
    setModalSrc(src);
  };

  const closeModal = () => {
    setModalSrc(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <img
        src={src}
        className="cursor-pointer"
        onClick={handleImageClick}
        alt={`${alt} (thumbnail)`}
      />
      {modalSrc && (
        <div onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative ">
            <img src={modalSrc} alt={`${alt} (full size)`} onClick={closeModal} className="max-w-full max-h-full scale-100" />
            <span className="m-2 absolute top-0 right-0">
            <button
              onClick={closeModal}
              className="text-white bg-black w-6" 
            >
              &times;
            </button>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModalClient;