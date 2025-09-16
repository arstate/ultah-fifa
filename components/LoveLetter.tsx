import React, { useState, useEffect } from 'react';
import HeartIcon from './icons/HeartIcon';

interface LoveLetterProps {
  onPoemRead: () => void;
}

const LoveLetter: React.FC<LoveLetterProps> = ({ onPoemRead }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      // Show the button shortly after the flip animation starts
      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, 1200); // Wait for the flip to be mostly done

      return () => {
        clearTimeout(buttonTimer);
      };
    }
  }, [isFlipped]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className={`transition-opacity duration-500 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-rose-500 mb-4">
            Hai FIFA Sayang...
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Aku punya sesuatu untukmu. Klik kartu di bawah ini ya...
          </p>
      </div>

      {/* 3D Perspective Container */}
      <div 
        className="relative w-80 h-96 md:w-96 md:h-[28rem] cursor-pointer group"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        onKeyPress={(e) => e.key === 'Enter' && handleFlip()}
        aria-label="Balikkan surat untuk membaca"
        role="button"
        tabIndex={0}
      >
        {/* The flipper element */}
        <div
            className="relative w-full h-full transition-transform duration-1000"
            style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
        >
            {/* Back of the card */}
            <div
                className="absolute w-full h-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-4"
                style={{ backfaceVisibility: 'hidden' }}
            >
                <p className="text-xl text-gray-400 font-semibold">Klik untuk membaca</p>
                <div className="mt-4">
                    <HeartIcon className="w-16 h-16 text-rose-200" />
                </div>
            </div>

            {/* Front of the card (the letter content) */}
            <div
                className="absolute w-full h-full bg-white rounded-lg shadow-xl p-6 text-left"
                style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                }}
            >
                <h2 className="text-xl font-semibold text-rose-700 mb-4 text-center">Untuk FIFA Tercinta,</h2>
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
        </div>
      </div>
      
      {showButton && (
        <button
          onClick={onPoemRead}
          className="mt-12 px-8 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          Lanjut ke Kejutan Berikutnya!
        </button>
      )}
    </div>
  );
};

export default LoveLetter;