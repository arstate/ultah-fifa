
import React, { useState, useEffect } from 'react';
import HeartIcon from './icons/HeartIcon';

interface LoveLetterProps {
  onPoemRead: () => void;
}

const LoveLetter: React.FC<LoveLetterProps> = ({ onPoemRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className={`text-4xl md:text-5xl font-bold text-rose-500 mb-4 transition-opacity duration-1000 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
        Hai Fifi Sayang...
      </h1>
      <p className={`text-lg text-gray-600 mb-8 transition-opacity duration-1000 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
        Aku punya sesuatu untukmu. Coba buka surat ini ya...
      </p>

      <div 
        className="relative w-80 h-52 md:w-96 md:h-60 cursor-pointer perspective-1000"
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Envelope Back */}
        <div className="absolute w-full h-full bg-rose-200 rounded-lg shadow-2xl"></div>
        
        {/* Paper */}
        <div className={`absolute w-[95%] h-[95%] top-[2.5%] left-[2.5%] bg-white shadow-inner p-6 transform transition-transform duration-1000 ease-in-out ${isOpen ? 'translate-y-[-60%]' : 'translate-y-0'}`}>
            <h2 className="text-xl font-semibold text-rose-700 mb-4">Untuk Fifi Tercinta,</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Di hari istimewamu yang ke-24, puisiku mungkin tak seindah senyummu, tapi setiap katanya tulus dari hatiku.
              Kamu adalah melodi terindah dalam hidupku.
              <br/><br/>
              Selamat ulang tahun, cintaku. Semoga hari ini dan selamanya, kamu selalu bahagia.
            </p>
             <div className="absolute bottom-4 right-4">
                <HeartIcon className="w-8 h-8 text-red-400" />
            </div>
        </div>

        {/* Envelope Front */}
        <div className="absolute w-full h-full bg-rose-300 rounded-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%)' }}></div>
        
        {/* Flap */}
        <div 
          className={`absolute w-full h-1/2 top-0 left-0 bg-rose-400 rounded-t-lg origin-bottom transition-transform duration-700 ease-out shadow-lg ${isOpen ? 'transform rotate-x-180' : ''}`}
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        >
          <div className="absolute w-full h-full bg-rose-300 transform rotate-x-180" style={{ backfaceVisibility: 'hidden' }}></div>
        </div>

         {/* Heart Seal */}
         <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
            <HeartIcon className="w-8 h-8 text-red-500" />
        </div>
      </div>
      
      {showButton && (
        <button
          onClick={onPoemRead}
          className="mt-24 px-8 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          Lanjut ke Kejutan Berikutnya!
        </button>
      )}
    </div>
  );
};

export default LoveLetter;
