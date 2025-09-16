
import React, { useState, useEffect, useRef, useCallback } from 'react';
import FlameIcon from './icons/FlameIcon';

interface BirthdayCakeProps {
  onCandlesBlown: () => void;
}

const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onCandlesBlown }) => {
  const [candlesLit, setCandlesLit] = useState([true, true]);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [showNextButton, setShowNextButton] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  const allBlownOut = candlesLit.every(lit => !lit);

  const blowOutCandles = useCallback(() => {
    setCandlesLit([false, false]);
    setTimeout(() => setShowNextButton(true), 1500);
  }, []);
  
  const stopMic = useCallback(() => {
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
    }
  }, []);

  const handleMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission('granted');
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const detectBlow = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          if (average > 50) { // Threshold for "blowing" sound
            blowOutCandles();
            stopMic();
          }
        }
        animationFrameRef.current = requestAnimationFrame(detectBlow);
      };
      
      detectBlow();

    } catch (err) {
      console.error('Microphone access denied:', err);
      setMicPermission('denied');
    }
  }, [blowOutCandles, stopMic]);

  useEffect(() => {
    if (micPermission === 'granted' && !allBlownOut) {
        handleMic();
    }
    return () => {
      stopMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micPermission, allBlownOut]);


  const renderCandle = (isLit: boolean, key: number, digit: string) => (
    <div key={key} className="relative flex flex-col items-center mx-2">
      {isLit && <FlameIcon className="absolute -top-10 w-8 h-12 text-amber-400 flame-flicker" />}
      <div className={`font-bold text-7xl ${isLit ? 'text-rose-400' : 'text-rose-800'}`}>{digit}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <div className="transition-all duration-1000" style={{ opacity: allBlownOut ? 0.5 : 1 }}>
        <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-2">
            {allBlownOut ? "Horeee! Make a wish!" : "Selamat Ulang Tahun yang ke-24!"}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
            {allBlownOut ? "Semoga semua keinginanmu terkabul..." : "Tutup matamu, buat permohonan, lalu tiup lilinnya..."}
        </p>

        <div className="relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex justify-center">
            {renderCandle(candlesLit[0], 0, '2')}
            {renderCandle(candlesLit[1], 1, '4')}
          </div>
          {/* Cake Layers */}
          <div className="w-80 h-16 bg-pink-300 rounded-t-full mt-24"></div>
          <div className="w-80 h-16 bg-rose-300 -mt-2"></div>
           <div className="w-80 h-4 bg-white/70 -mt-10 rounded-full"></div>
        </div>
      </div>
      
      {!allBlownOut && micPermission === 'prompt' && (
        <button onClick={handleMic} className="mt-12 px-6 py-3 bg-sky-500 text-white font-bold rounded-full shadow-lg hover:bg-sky-600 transition-transform hover:scale-105">
            Aktifkan Mikrofon untuk Meniup
        </button>
      )}

      {!allBlownOut && micPermission === 'denied' && (
        <div className="mt-12 text-center">
            <p className="text-sm text-red-600 mb-4">Mikrofon tidak diizinkan. Klik tombol di bawah ini untuk meniup lilin.</p>
            <button onClick={blowOutCandles} className="px-6 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transition-transform hover:scale-105">
                Tiup Lilin!
            </button>
        </div>
      )}

      {showNextButton && (
        <button
          onClick={onCandlesBlown}
          className="mt-12 px-8 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          Lihat Hadiah Terakhir!
        </button>
      )}
    </div>
  );
};

export default BirthdayCake;
