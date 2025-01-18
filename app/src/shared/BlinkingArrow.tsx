import React from 'react';

const BlinkingImage = () => {
  // Define the keyframe animation directly in the component's style
  const blinkStyle = {
    animation: 'blink-animation 0.75s steps(5, start) infinite',
  };

  return (
    <div>
      <img 
        src={`${process.env.PUBLIC_URL}/down-arrow.png`} 
        width={40} 
        style={blinkStyle}
        alt="down arrow"
      />
      <style>
        {`
          @keyframes blink-animation {
            to {
              visibility: hidden;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BlinkingImage;