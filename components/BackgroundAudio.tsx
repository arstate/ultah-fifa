
import React from 'react';

const BackgroundAudio: React.FC = () => {
  const audioUrl = "https://audio.com/embed/audio/1795069834927003?theme=image&autoplay=true";

  return (
    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
      <iframe
        src={audioUrl}
        allow="autoplay; encrypted-media"
        style={{
          display: 'block',
          border: 'none'
        }}
        title="Background Audio Player"
        aria-hidden="true"
      ></iframe>
    </div>
  );
};

export default BackgroundAudio;