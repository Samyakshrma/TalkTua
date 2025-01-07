import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/view');
        if (!response.ok) {
          throw new Error('Failed to fetch image list');
        }
        const imageList = await response.json();
        
        const imagesWithContent = await Promise.all(
          imageList.map(async (img) => {
            const contentResponse = await fetch(`http://127.0.0.1:8000/image/${img.id}`);
            if (!contentResponse.ok) {
              throw new Error(`Failed to fetch image ${img.id}`);
            }
            const contentData = await contentResponse.json();
            return {
              id: img.id,
              filename: img.filename,
              url: `data:image/jpeg;base64,${contentData.content}`
            };
          })
        );
        
        setImages(imagesWithContent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <h1 className="text-2xl font-bold p-4 text-center bg-white shadow-sm">Image Gallery</h1>
      
      <div className="flex-1 overflow-y-auto p-4">
        {images.length === 0 ? (
          <p className="text-center text-gray-500">No images found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {images.map((image) => (
              <div 
                key={image.id}
                className="w-full aspect-square bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-full">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                    {image.filename}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;