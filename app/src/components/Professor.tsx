import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SlowText from "../shared/SlowText";
import BlinkingArrow from "../shared/BlinkingArrow";
import BlinkingSideArrow from "../shared/BlinkingSideArrow";

type InputProps = {
  setTeam: (x: number) => void;
  onComplete: () => void;
}

const Professor = ({ setTeam, onComplete }: InputProps) => {
  const [mode, setMode] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    // Track enter is pressed
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (mode < 10) {
          setMode(mode + 1);
        } else if (mode === 10) {
          onComplete();
        }
      } else if (e.key === 'ArrowDown') {
        if ((selected === 0) && (mode === 8)) {
          setSelected(1);
          setTeam(1);
        } 
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        if ((selected === 1) && (mode === 8)) {
          setSelected(0);
          setTeam(0);
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selected]);

  const getText = () => {
    if (mode === 0) {
      return "Hello there! Welcome to the world of Wuliumon!";
    } else if (mode === 1) {
      return "My name is Professor Oak. I hear you have been invited";
    } else if (mode === 2) {
      return "to the wedding of Mike and Connie.";
    } else if (mode === 3) {
      return "Not so fast I say.  First, you’ll have to defeat me...";
    } else if (mode === 4) {
      return "in a Wuliumon battle!";
    } else if (mode === 5) {
      return "Wait, you didn’t bring your Wuliumon?  So unprepared...";
    } else if (mode === 6) {
      return "No matter.  I will lend you some Wuliumon for today.";
    } else if (mode === 7) {
      return "Luckily, two trainers left their Wuliumon in my care.";
    } else if (mode === 8) {
      return "Please choose a trainer's Wuliumon to use...";
    } else if (mode === 9) {
      const name = selected === 1 ? "Connie" : "Mike"
      const otherName = selected === 1 ? "Mike" : "Connie";
      return `Great! You use ${otherName}'s and I will use ${name}'s.`;
    } else if (mode === 10) {
      return "Get ready... Prepare for battle!";
    }
    else {
      return "";
    }
  }

  return (
    <Box 
      justifyContent="center"
      alignItems="center"
      style={{ 
        backgroundColor: "white",
        width: 600,
        height: 600,
        margin: "0 auto",
        borderRadius: 4,
        position: 'relative', // Add relative positioning
      }}
    >
      <Box 
        style={{ textAlign: "center" }}
        sx={{ pt: 12, pb: 2, pl: mode === 8 ? 46 : 0 }}
      >
        <img src={`${process.env.PUBLIC_URL}/professor.png`} height={280} alt="professor oak" />
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
          alt="text box"
          width={600} 
        />
        <Box
          sx={{ px: 7, pt: 5 }}
          style={{ position: "absolute" }}
        >
          <Typography style={{ fontWeight: "light", fontSize: 24, lineHeight: 2.3}}> 
            <SlowText text={getText()} speed={50} />
          </Typography>
        </Box>
        {(mode !== 8) && (
          <Box
            style={{ 
              position: "absolute",
              right: 40,
              top: 120,
            }} 
          >
            <BlinkingArrow />
          </Box>
        )}
      </Box>
      {(mode === 8) && (
        <Box
          style={{
            position: "absolute", // Absolute positioning for the text box
            top: 75, // Adjusts the bottom distance from the white box border
            left: 0,
            // left: "50%", // Centers the text horizontally
            // transform: "translateX(-50%)", // Centers the box relative to its width
            width: '100%', // Ensures the box takes full width
          }}
        >
          <img 
            style={{ position: "absolute" }} 
            src={`${process.env.PUBLIC_URL}/square-box.png`}
            alt="square box"
            width={400}
          />
          <Box
            sx={{ 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
            style={{ 
              position: "absolute",
              top: 60,
              left: selected === 0 ? 60 : 106,
            }}
          >
            {selected === 0 && <BlinkingSideArrow />}
            <Typography style={{ fontWeight: "light", fontSize: 24 }}> 
              Connie
            </Typography>
          </Box>
          <Box
            sx={{ 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
            style={{ 
              position: "absolute",
              top: 150,
              left: selected === 1 ? 60 : 106,
            }}
          >
            {selected === 1 && <BlinkingSideArrow />}
            <Typography style={{ fontWeight: "light", fontSize: 24 }}> 
              Mike
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Professor;