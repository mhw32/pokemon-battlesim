import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SlowText from "../shared/SlowText";
import BlinkingArrow from "../shared/BlinkingArrow";

type InputProps = {
  onWin: () => void;
}

const WinOutro = ({ onWin }: InputProps) => {
  const [mode, setMode] = useState<number>(0);

  useEffect(() => {
    // Track enter is pressed
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (mode === 0) {
          setMode(1);
        } else if (mode === 1) {
          setMode(2);
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
      return "Unbelievable!  Well, I guess you earned this...";
    } else if (mode === 1) {
      return "You received an INVITATION!";
    } 
    return "";
  }

  return (
    <Box 
      justifyContent="center"
      alignItems="center"
      style={{ 
        backgroundColor: mode === 2 ? "black" : "white",
        width: 600,
        height: 600,
        margin: "0 auto",
        borderRadius: 4,
        position: 'relative', // Add relative positioning
      }}
    >
      <audio autoPlay src={`${process.env.PUBLIC_URL}/music/1-07. Victory! (Trainer).mp3`} />   
      {mode === 2 ? (
        <video 
          src={`${process.env.PUBLIC_URL}/evolution-finale.mp4`} 
          width={600}
          height={600}
          style={{ borderRadius: 4 }}
          autoPlay
          loop={false}
          onEnded={() => onWin()}
          muted
        />
      ) : (
        <Box>
          <Box 
            style={{ textAlign: "center" }}
            sx={{ pt: 12, pb: 2, pl: mode === 6 ? 46 : 0 }}
          >
            <img src={`${process.env.PUBLIC_URL}/professor.png`} height={280} alt="professor oak" />
          </Box>
          <Box style={{ position: "absolute", bottom: 180, left: 0, width: '100%' }}>
            <img 
              style={{ position: "absolute" }} 
              src={`${process.env.PUBLIC_URL}/text-box.png`} 
              width={600} 
              alt="text box"
            />
            <Box
              sx={{ px: 7, pt: 5 }}
              style={{ position: "absolute" }}
            >
              <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3 }}> 
                <SlowText text={getText()} speed={50} />
              </Typography>
            </Box>
            <Box style={{ position: "absolute", right: 40, top: 120 }}>
              <BlinkingArrow />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default WinOutro;