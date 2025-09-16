import React, { useState, useEffect } from 'react';

// Tentukan struktur untuk sisa waktu
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FinalSurprise: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const calculateTimeLeft = (): TimeLeft | null => {
    // Tanggal target: 19 September 2025, 10:00 WIB (UTC+7)
    const targetDate = new Date('2025-09-19T10:00:00+07:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return null; // Hitung mundur selesai
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Bersihkan interval saat komponen dibongkar
    return () => clearInterval(timer);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const TimerDisplay: React.FC<{ timeValue: number; timeUnit: string; pad?: boolean }> = ({ timeValue, timeUnit, pad = true }) => (
    <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
      <span className="text-4xl md:text-5xl font-bold text-rose-600">
        {pad ? String(timeValue).padStart(2, '0') : timeValue}
      </span>
      <span className="text-sm text-gray-500 uppercase tracking-wider">{timeUnit}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <div className={`transition-opacity duration-500 mb-8`}>
          <h1 className="text-4xl md:text-5xl font-bold text-rose-500 mb-4">
            Eh, ada satu lagi...
          </h1>
          <p className="text-lg text-gray-600">
            Hitung mundur menuju kejutan berikutnya!
          </p>
      </div>

      {/* Countdown Timer */}
      <div className="my-6">
        {timeLeft ? (
          <div className="flex justify-center gap-4 md:gap-8 p-4 bg-white/70 rounded-xl shadow-lg">
             <TimerDisplay timeValue={timeLeft.days} timeUnit="Hari" pad={false} />
             <TimerDisplay timeValue={timeLeft.hours} timeUnit="Jam" />
             <TimerDisplay timeValue={timeLeft.minutes} timeUnit="Menit" />
             <TimerDisplay timeValue={timeLeft.seconds} timeUnit="Detik" />
          </div>
        ) : (
          <div className="text-3xl font-bold text-rose-500 animate-pulse p-4 bg-white/70 rounded-xl shadow-lg">
            Waktunya Tiba!
          </div>
        )}
      </div>

      <div className={`transition-opacity duration-500 mb-8`}>
          <p className="text-lg text-gray-600">
            Sambil menunggu, coba klik kertas di bawah ini.
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