
import React, { useState } from 'react';

const FinalSurprise: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className={`transition-opacity duration-500 mb-8`}>
          <h1 className="text-4xl md:text-5xl font-bold text-rose-500 mb-4">
            Eh, ada satu lagi...
          </h1>
          <p className="text-lg text-gray-600">
            Coba klik kertas di bawah ini.
          </p>
      </div>

      <div 
        className="relative w-80 h-96 md:w-96 md:h-[28rem] cursor-pointer group"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
        onKeyPress={(e) => e.key === 'Enter' && handleFlip()}
        aria-label="Balikkan kertas"
        role="button"
        tabIndex={0}
      >
        <div
            className="relative w-full h-full transition-transform duration-1000"
            style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
        >
            {/* Back of the paper (blank) */}
            <div
                className="absolute w-full h-full bg-white rounded-lg shadow-xl flex items-center justify-center p-4"
                style={{ backfaceVisibility: 'hidden' }}
            >
                <p className="text-xl text-gray-300 font-semibold italic">(kosong)</p>
            </div>

            {/* Front of the paper (the message) */}
            <div
                className="absolute w-full h-full bg-white rounded-lg shadow-xl p-6 flex flex-col items-center justify-center text-center"
                style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                }}
            >
                <span className="text-8xl font-bold text-rose-400 mb-4">?</span>
                <h2 className="text-2xl font-semibold text-rose-700">Eits, kejutannya belum selesai...</h2>
                <p className="text-md text-gray-600 mt-4">Ada satu hadiah lagi, yang paling spesial. <br/> Tapi... kamu harus lihat langsung. Aku tunggu ya!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSurprise;
