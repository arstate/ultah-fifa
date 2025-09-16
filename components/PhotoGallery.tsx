
import React from 'react';

const images = [
  'https://picsum.photos/seed/love1/400/600',
  'https://picsum.photos/seed/love2/600/400',
  'https://picsum.photos/seed/love3/400/400',
  'https://picsum.photos/seed/love4/600/400',
  'https://picsum.photos/seed/love5/400/600',
  'https://picsum.photos/seed/love6/400/400',
];

const PhotoGallery: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4 animate-fade-in-down">
        Kenangan Indah Kita
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Setiap momen bersamamu adalah anugerah. Ini hanya sebagian kecil dari cerita kita yang tak akan pernah berakhir.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {images.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <img 
              src={src} 
              alt={`Kenangan ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-white/80 rounded-xl shadow-lg">
          <p className="text-xl md:text-2xl font-bold text-rose-800">
            Semoga semua mimpimu terwujud. Aku sangat mencintaimu, Fifi.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-rose-500 mt-2">
            Happy 24th Birthday!
          </p>
      </div>
    </div>
  );
};

export default PhotoGallery;
