
import React, { useState } from 'react';
import LoveLetter from './components/LoveLetter';
import BirthdayCake from './components/BirthdayCake';
import PhotoGallery from './components/PhotoGallery';

type View = 'letter' | 'cake' | 'gallery';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('letter');

  const renderView = () => {
    switch (currentView) {
      case 'letter':
        return <LoveLetter onPoemRead={() => setCurrentView('cake')} />;
      case 'cake':
        return <BirthdayCake onCandlesBlown={() => setCurrentView('gallery')} />;
      case 'gallery':
        return <PhotoGallery />;
      default:
        return <LoveLetter onPoemRead={() => setCurrentView('cake')} />;
    }
  };

  return (
    <main className="bg-rose-50 min-h-screen w-full flex items-center justify-center font-serif text-gray-800 p-4 transition-colors duration-1000">
      <div className="w-full max-w-4xl mx-auto">
        {renderView()}
      </div>
    </main>
  );
};

export default App;
