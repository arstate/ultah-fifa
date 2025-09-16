
import React from 'react';

const images = [
  'https://lh3.googleusercontent.com/pw/AP1GczPMPfbLRiSxVEZHVL3wW6OgeKErJ5-R9CbpdQVgW53d6vnq0__rOUlJQv3kh_Vo0i8Y2qCGuQZDm7OdrVO-XwNlrcgM9OwuWWXMhjOiPrJH-HKPykE=w2400',
  'https://lh3.googleusercontent.com/pw/AP1GczP3d_FqC9zyQAHu1euLi5Ua7CeByP3cVvYtE7VD4lUqFp8fmzy4FAqD1NcbqVQl0dHv10eRJfR2pVbmkyfRv2l8q2t7lKhtVppN5JaMjadAdR8OQas=w2400',
  'https://lh3.googleusercontent.com/pw/AP1GczNA-EFZXZ9kABJisUFSBpzVQQV5xI2KImsglVyWv5kIwmuvjUuE17mFnbg5jtaYrucsxpI1DeOd3bGGpNornv1M7VNqEb5QFC0b5DabEzf7jGtWcpk=w2400',
  'https://lh3.googleusercontent.com/pw/AP1GczMWfGgPOZAd1ohMB_Zug_B08F8f37JsO51MhcSIm7yc7f18wpWae9aIATdRg3NJkfdE0y7AQpBqi5C6f5I9f3deHgevQ5IcDNUMitP8ZkFdF7aPXs8=w2400',
  'https://lh3.googleusercontent.com/pw/AP1GczPEcmt7-nEdddqU0Y8cOVq7t6639WVVRUowlfACte4Z2AooFbJIJcaBYFUusMgJZzuQENpBbRGW6diLuMkbrSZaRUfWRR1G5D8BgN7eOaf_y4CJQIs=w2400',
  'https://lh3.googleusercontent.com/pw/AP1GczOgIFvYXV1BU-5PLECsK1Ytvg6lh6ztVpRnDbnWZ0hs9YoGAWTOJrP1TFKfZwaRqIQ8aiBx2F29-9Nllx4RilA8Wpyoz2pfCHpu5w2xRqCSoxSfdW4=w2400',
];

interface PhotoGalleryProps {
  onShowFinalSurprise: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onShowFinalSurprise }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <h2 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4 animate-fade-in-down">
        Kenangan Indah Arya & FIFA
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
            Semoga semua mimpimu terwujud. Aku sangat mencintaimu, FIFA.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-rose-500 mt-2">
            Happy 24th Birthday!
          </p>
      </div>
       <button
          onClick={onShowFinalSurprise}
          className="mt-12 px-8 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          Lihat Kejutan Terakhir
        </button>
    </div>
  );
};

export default PhotoGallery;