import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SlowText from "../shared/SlowText";
import BlinkingArrow from "../shared/BlinkingArrow";


const LoseOutro = () => {
  const [mode, setMode] = useState<number>(0);

  useEffect(() => {
    // Track enter is pressed
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (mode === 0) {
          setMode(1);
        } else if (mode === 1) {
          setMode(2);
        } else if (mode === 2) {
          setMode(3);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [mode]);

  const getText = (): string => {
    if (mode === 0) {
      return "Not so lucky this time...";
    } else if (mode === 1) {
      return "And you know what that means.  No win, no invite.";
    } else if (mode === 2) {
      return "Come back later (or refresh the page). ";
    }
    return "";
  }

  return (
    <Box 
      justifyContent="center"
      alignItems="center"
      style={{ 
        backgroundColor: mode === 3 ? "black" : "white",
        width: 600,
        height: 600,
        margin: "0 auto",
        borderRadius: 4,
        position: 'relative', // Add relative positioning
      }}
    >
      <audio autoPlay src={`${process.env.PUBLIC_URL}/music/1-36. LoseOutro.mp3`} />         
      {mode === 3 ? (
        <Box 
          justifyContent="center" 
          alignItems="center"
          sx={{
            display: 'flex', // Flexbox for centering content inside this Box
            height: '100%', // Ensure it takes full height to center vertically
            width: '100%',  // Ensure it takes full width to center horizontally
          }}
        >
          <Typography style={{ fontWeight: "bold", fontSize: 30, color: "white" }}> 
            GAME OVER
          </Typography>
        </Box>
      ): (
        <Box>
          <Box 
            style={{ textAlign: "center" }}
            sx={{ pt: 12, pb: 2, pl: mode === 6 ? 46 : 0 }}
          >
            <img src={`${process.env.PUBLIC_URL}/professor.png`} height={280} />
          </Box>
          <Box
            style={{
              position: "absolute", // Absolute positioning for the text box
              bottom: 180, // Adjusts the bottom distance from the white box border
              left: 0,
              // left: "50%", // Centers the text horizontally
              // transform: "translateX(-50%)", // Centers the box relative to its width
              width: '100%', // Ensures the box takes full width
            }}
          >
            <img 
              style={{ position: "absolute" }} 
              src={`${process.env.PUBLIC_URL}/text-box.png`} 
              width={600} 
            />
            <Box
              sx={{ px: 7, pt: 5 }}
              style={{ position: "absolute" }}
            >
              <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3 }}> 
                <SlowText text={getText()} speed={50} />
              </Typography>
            </Box>
            <Box
              style={{ 
                position: "absolute",
                right: 40,
                top: 120,
              }} 
            >
              <BlinkingArrow />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default LoseOutro;