import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import BlinkingText from "../shared/BlinkingText";
import Professor from "./Professor";
import Battle from "./Battle";
import toast from "react-hot-toast";

type InputProps = {
  onWin: (score: number, team: number) => void;
  onSkip: () => void;
}

const Game = ({ onWin, onSkip }: InputProps) => {
  const [mode, setMode] = useState<number>(0);
  const [team, setTeam] = useState<number>(0);
  // Reference to the audio element
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isGameAudioPlaying, setIsGameAudioPlaying] = useState<boolean>(false);

  // React to changes in `isPlaying` state
  useEffect(() => {
    if (!gameAudioRef.current) return;
    if (isGameAudioPlaying) {
      gameAudioRef.current.play();
    } else {
      gameAudioRef.current.pause();
    }
  }, [isGameAudioPlaying]);

  useEffect(() => {
    if (mode === 0) {
      // Track enter is pressed
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') setMode(2);
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    } else if (mode === 2 || mode === 3) {
      // Track enter is pressed
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') setMode(mode + 1);
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    } else if (mode === 6) {
      setIsGameAudioPlaying(true);
    }
  }, [mode]);

  const getContent = () => {
    if (mode === 0) {
      return (
        <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ 
            backgroundColor: "#e9c46a",
            width: 600,
            height: 600,
            margin: "0 auto",
            borderRadius: 4,
          }}
        >
          <Box>
            <Stack 
              direction="row" 
              spacing={2} 
              style={{ alignItems: "center" }}
            >
              <Button style={{ borderRadius: 4, backgroundColor: "white" }}
                onClick={() => setMode(2)}
              >
                <Typography style={{ color: "black" }}>
                  Run game
                </Typography>
              </Button>
            </Stack>
          </Box>
        </Box>
      );
    } else if (mode === 2) {
      return (
        <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ 
            backgroundColor: "black",
            width: 600,
            height: 600,
            margin: "0 auto",
            borderRadius: 4,
          }}
        >
          <video 
            src={`${process.env.PUBLIC_URL}/intro-video.mp4`} 
            width={600}
            height={600}
            autoPlay
            style={{ borderRadius: 4 }}
            muted
            onEnded={() => setMode(3)}
          />
          <audio autoPlay src={`${process.env.PUBLIC_URL}/music/1-01 Untitled.mp3`} />
        </Box>
      );
    } else if (mode === 3) {
      return (
        <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ 
            backgroundColor: "white",
            width: 600,
            height: 600,
            margin: "0 auto",
            borderRadius: 4,
          }}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/start-screen.png`} 
            width={600}
            height={600}
            style={{ borderRadius: 4 }}
          />
          <Box sx={{ position: "absolute", top: 50 }}>
            <BlinkingText text="press enter to play..." color="#0000FF"/>
          </Box>
          <audio autoPlay src={`${process.env.PUBLIC_URL}/music/1-03. 1-04. combined.mp3`} />
        </Box>

      );
    } else if (mode === 4) {
      return (
        <Box>
          <Professor setTeam={setTeam} onComplete={() => setMode(5)} />
          <audio autoPlay src={`${process.env.PUBLIC_URL}/music/1-05. Professor Oak Talking.mp3`}
          />
        </Box>
      );
    } else if (mode === 5) {
      return (
        <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ 
            backgroundColor: "white",
            width: 600,
            height: 600,
            margin: "0 auto",
            borderRadius: 4,
          }}
        >
          <video 
            src={`${process.env.PUBLIC_URL}/battle-transition.mp4`} 
            width={600}
            height={600}
            autoPlay
            style={{ borderRadius: 4 }}
            onEnded={() => setMode(6)}
          />
          <audio autoPlay src={`${process.env.PUBLIC_URL}/music/1-06. Battle! (Trainer).mp3`}
          />
        </Box>
      );
    } else if (mode === 6) {
      return (
        <Box>
          <Battle team={team} onWin={onWin} stopAudio={() => {
            setIsGameAudioPlaying(false);
            gameAudioRef.current = null;
          }} />
          {isGameAudioPlaying && (
            <audio 
              ref={gameAudioRef}  
              loop 
              src={`${process.env.PUBLIC_URL}/music/1-06. BattleTrimmed.mp3`} 
              onCanPlay={() => setIsGameAudioPlaying(true)}
            />
          )}
        </Box>
      );
    } else {
      return <></>;
    }
  }

  return (
    <Box>
      {getContent()}
      <Box sx={{ mt: 3 }}>
        <Typography style={{ color: "black", fontSize: 12, textAlign: "center" }}>
          <b>INSTRUCTIONS:</b> ENTER to select, BACKSPACE to go back
        </Typography>
      </Box>
    </Box>
  );
}

export default Game;