import React from 'react';
import { Typography } from '@mui/material';

const BlinkingText = ({text, color}) => {
  // Define the keyframe animation directly in the component's style
  const blinkStyle = {
    animation: 'blink-animation 0.75s steps(5, start) infinite',
  };

  return (
    <div>
      <Typography 
        style={blinkStyle}
        sx={{
          fontWeight: "bold",
          fontSize: 20,
          color: color
        }}
      >
        {text}
      </Typography>
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

export default BlinkingText;