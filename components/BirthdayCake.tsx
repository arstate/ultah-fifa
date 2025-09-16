
import React, { useState, useEffect, useRef, useCallback } from 'react';
import FlameIcon from './icons/FlameIcon';

// FIX: Add type definitions for Web Speech API to the global window object
// to resolve errors about missing properties.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface BirthdayCakeProps {
  onCandlesBlown: () => void;
}

type Phase = 'prompt' | 'permission_denied' | 'wishing' | 'blowing' | 'blown';

const wishPrompts = [
    "Pertama, ucapkan permohonan untuk dirimu sendiri...",
    "Kedua, apa harapanmu untukku di masa depan?",
    "Terakhir, apa permohonanmu untuk hubungan kita?"
];

const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onCandlesBlown }) => {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [phase, setPhase] = useState<Phase>('prompt');
  const [wishes, setWishes] = useState<string[]>(['', '', '']);
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const blowCooldownRef = useRef(false);

  const allBlownOut = candlesLit.every(isLit => !isLit);

  const stopAllMedia = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      stopAllMedia();
    };
  }, [stopAllMedia]);

  useEffect(() => {
    // Transition to 'blown' phase when all candles are out
    if (allBlownOut && (phase === 'blowing' || phase === 'permission_denied')) {
      stopAllMedia();
      setPhase('blown');
    }
  }, [candlesLit, phase, allBlownOut, stopAllMedia]);


  const startWishing = useCallback(async () => {
    stopAllMedia();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onstart = () => {
            setPhase('wishing');
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript.trim() + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                 setCurrentTranscript(prev => (prev.trim() + ' ' + finalTranscript.trim()).trim());
            }
        };

        recognition.start();
      } else {
        console.error('Speech Recognition not supported. Skipping to blowing phase.');
        startBlowing();
      }

    } catch (err) {
      console.error('Microphone access denied:', err);
      setPhase('permission_denied');
    }
  }, [stopAllMedia]);


  const startBlowing = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    setPhase('blowing');

    if (!streamRef.current) {
        console.error("Mic stream not available for blow detection.");
        setPhase('permission_denied');
        return;
    }

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(streamRef.current);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const detectBlow = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      let blowEnergy = 0;
      for (let i = 0; i < 20; i++) {
        blowEnergy += dataArray[i];
      }
      
      const avgLowFreqEnergy = blowEnergy / 20;

      if (avgLowFreqEnergy > 110 && !blowCooldownRef.current) {
        console.log('Blow detected! Average low-frequency energy:', avgLowFreqEnergy);
        
        blowCooldownRef.current = true; // Start cooldown

        setCandlesLit(prevCandles => {
            const newCandles = [...prevCandles];
            const candleToBlowIndex = newCandles.findIndex(isLit => isLit);
            if (candleToBlowIndex !== -1) {
                newCandles[candleToBlowIndex] = false;
            }
            return newCandles;
        });

        setTimeout(() => {
            blowCooldownRef.current = false;
        }, 1500); // 1.5 second cooldown
      }
      
      animationFrameRef.current = requestAnimationFrame(detectBlow);
    };
    
    detectBlow();
  }, []);

  const saveWishesToFirebase = async (finalWishes: string[]) => {
    const FIREBASE_URL = 'https://ultah-fifa-default-rtdb.asia-southeast1.firebasedatabase.app/wishes.json';

    const payload = {
        wishForSelf: finalWishes[0],
        wishForPartner: finalWishes[1],
        wishForUs: finalWishes[2],
        timestamp: new Date().toISOString(),
    };

    try {
        const response = await fetch(FIREBASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to save wishes. Status: ${response.status}`);
        }

        console.log('Wishes successfully saved to Firebase!');
    } catch (error) {
        console.error('Error saving wishes to Firebase:', error);
        // We don't show an error to the user to keep the experience smooth.
    }
  };


  const handleNextWish = () => {
    const newWishes = [...wishes];
    newWishes[currentWishIndex] = currentTranscript || "(tidak ada permohonan)";
    setWishes(newWishes);
    setCurrentTranscript('');

    if (currentWishIndex < wishPrompts.length - 1) {
        setCurrentWishIndex(currentWishIndex + 1);
    } else {
        // This is the final wish, save all wishes to Firebase before proceeding
        saveWishesToFirebase(newWishes);
        startBlowing();
    }
  };

  const handleManualBlow = () => {
    setCandlesLit(prevCandles => {
        const newCandles = [...prevCandles];
        const candleToBlowIndex = newCandles.findIndex(isLit => isLit);
        if (candleToBlowIndex !== -1) {
            newCandles[candleToBlowIndex] = false;
        }
        return newCandles;
    });
  };


  const renderContent = () => {
    const candlesRemaining = candlesLit.filter(Boolean).length;
    switch(phase) {
      case 'prompt':
        return (
          <>
            <p className="text-lg text-gray-600 mb-8">Ada 3 permohonan yang harus kamu ucapkan...</p>
            <button onClick={startWishing} className="mt-12 px-6 py-3 bg-sky-500 text-white font-bold rounded-full shadow-lg hover:bg-sky-600 transition-transform hover:scale-105">
                Aktifkan Mikrofon & Mulai Berdoa
            </button>
          </>
        );
      case 'wishing':
        const isLastWish = currentWishIndex === wishPrompts.length - 1;
        return (
          <>
            <div className="mt-12 p-4 bg-white/60 rounded-xl shadow-inner w-full max-w-lg transition-opacity duration-500">
                <p className="text-gray-500 text-sm mb-1 font-semibold">{`Permohonan ${currentWishIndex + 1}/${wishPrompts.length}:`}</p>
                <p className="text-lg text-rose-800 font-bold mb-2">{wishPrompts[currentWishIndex]}</p>
                <p className="text-md italic text-gray-700 min-h-[2.5em] bg-white/50 p-2 rounded">
                    {currentTranscript ? `"${currentTranscript}"` : '...'}
                </p>
            </div>
            <button 
                onClick={handleNextWish} 
                disabled={!currentTranscript.trim()}
                className="mt-8 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLastWish ? 'Selesai, Saatnya Tiup Lilin!' : 'Lanjut ke Permohonan Berikutnya'}
            </button>
          </>
        );
      case 'blowing':
        return (
          <p className="mt-12 text-xl font-bold text-rose-300 animate-pulse">
            Sekarang... tiup lilinnya! ({candlesRemaining} tersisa)
          </p>
        );
      case 'permission_denied':
        return (
          <div className="mt-12 text-center">
              <p className="text-sm text-red-600 mb-4">Mikrofon tidak diizinkan. Klik tombol untuk meniup lilin satu per satu.</p>
              <button onClick={handleManualBlow} disabled={candlesRemaining === 0} className="px-6 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Tiup Satu Lilin! ({candlesRemaining} tersisa)
              </button>
          </div>
        );
      case 'blown':
        return (
          <>
               <div className="mt-12 p-4 bg-white/60 rounded-xl shadow-inner w-full max-w-lg text-left space-y-3">
                  <h3 className="text-center font-bold text-rose-800 text-lg mb-4">Semoga semua permohonanmu terkabul...</h3>
                  <div>
                      <p className="text-gray-600 text-sm font-semibold">1. Untuk Dirimu:</p>
                      <p className="text-md italic text-rose-900">"{wishes[0]}"</p>
                  </div>
                  <div>
                      <p className="text-gray-600 text-sm font-semibold">2. Untukku:</p>
                      <p className="text-md italic text-rose-900">"{wishes[1]}"</p>
                  </div>
                   <div>
                      <p className="text-gray-600 text-sm font-semibold">3. Untuk Kita:</p>
                      <p className="text-md italic text-rose-900">"{wishes[2]}"</p>
                  </div>
              </div>
              <button
                onClick={onCandlesBlown}
                className="mt-8 px-8 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                Lihat Kejutan Selanjutnya
              </button>
          </>
        );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <div className="transition-all duration-1000" style={{ opacity: allBlownOut ? 0.5 : 1 }}>
        <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-6">
            {allBlownOut ? "Horeee! Permohonanmu terkirim!" : "Selamat Ulang Tahun yang ke-24!"}
        </h2>
        
        <div className="relative flex flex-col items-center mt-20">
            {/* Candles */}
            <div className="absolute -top-12 flex space-x-3 z-10">
                {candlesLit.map((isLit, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                        {isLit && (
                           <div className="absolute -top-10 w-8 h-12">
                               <div className="candle-glow"/>
                               <FlameIcon className="relative w-full h-full text-amber-400 flame-flicker" />
                           </div>
                        )}
                        <div 
                            className="w-3 h-12 bg-white border-2 border-pink-300" 
                            style={{
                                backgroundImage: 'repeating-linear-gradient(-45deg, #fecdd3, #fecdd3 4px, white 4px, white 8px)',
                                boxShadow: allBlownOut ? 'none' : 'inset 2px 0 4px rgba(0,0,0,0.1)',
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Top Tier */}
            <div className="relative w-64">
                <div className="h-12 bg-pink-400 rounded-t-xl"></div>
                <div className="h-12 bg-amber-100"></div>
            </div>

            {/* Bottom Tier */}
            <div className="relative w-80 -mt-2">
                <div className="h-16 bg-pink-400 rounded-t-xl relative px-6 flex justify-between items-center">
                    {/* Cherries */}
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    ))}
                </div>
                <div className="h-16 bg-amber-100"></div>
            </div>

            {/* Plate */}
            <div className="w-96 h-6 bg-slate-200 rounded-full mt-1 shadow-inner"></div>
        </div>

      </div>
      
      {renderContent()}
    </div>
  );
};

export default BirthdayCake;
