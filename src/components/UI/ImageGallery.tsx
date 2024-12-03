"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: { url: string }[];
  toolName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, toolName }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeZoom = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="image-gallery">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="gallery-thumbnail" 
            onClick={() => handleImageClick(image.url)}
          >
            <Image 
              alt={`${toolName} image ${index + 1}`} 
              src={image.url} 
              width={500} 
              height={500} 
              className="max-width" 
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="image-zoom-overlay" onClick={closeZoom}>
          <div className="image-zoom-container">
            <Image 
              alt={`${toolName} zoomed image`} 
              src={selectedImage} 
              width={1000} 
              height={1000} 
              className="zoomed-image" 
            />
            <button className="close-zoom" onClick={closeZoom}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;