
import React, { useState } from 'react';
import LoveLetter from './components/LoveLetter';
import LoveLetter2 from './components/LoveLetter2';
import BirthdayCake from './components/BirthdayCake';
import PhotoGallery from './components/PhotoGallery';
import FinalSurprise from './components/FinalSurprise';
import BackgroundAudio from './components/BackgroundAudio';

type View = 'letter' | 'letter2' | 'cake' | 'gallery' | 'final';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('letter');
  const [hasInteracted, setHasInteracted] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'letter':
        return <LoveLetter onPoemRead={() => setCurrentView('letter2')} />;
      case 'letter2':
        return <LoveLetter2 onNext={() => setCurrentView('cake')} />;
      case 'cake':
        return <BirthdayCake onCandlesBlown={() => setCurrentView('gallery')} />;
      case 'gallery':
        return <PhotoGallery onShowFinalSurprise={() => setCurrentView('final')} />;
      case 'final':
        return <FinalSurprise />;
      default:
        return <LoveLetter onPoemRead={() => setCurrentView('letter2')} />;
    }
  };
  
  const handleInteraction = () => {
      if (!hasInteracted) {
          setHasInteracted(true);
      }
  };

  return (
    <main 
      className="bg-rose-50 min-h-screen w-full flex items-center justify-center font-serif text-gray-800 p-4 transition-colors duration-1000"
      onClick={handleInteraction}
    >
      <div className="w-full max-w-4xl mx-auto">
        {renderView()}
      </div>
      {hasInteracted && <BackgroundAudio />}
    </main>
  );
};

export default App;