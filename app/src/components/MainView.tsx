import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Game from './Game';
import MobileGame from './MobileGame';

const MainView = () => {
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Function to check if the screen width is less than 768 pixels
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    // Add event listener to track window resize
    window.addEventListener('resize', checkMobile);
    // Initial check
    checkMobile();
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Grid
      container
      columns={10}
      style={{
        justifyContent: "center",
        background: "#FEFECF",
        minHeight: "100vh", // Ensures the Box takes full viewport height
        width: "100vw",  // Ensures the Box takes full viewport width
      }}
    >
      <Grid item xs={1}
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/bulbasaur.webp)`, 
          backgroundRepeat: 'repeat',
          backgroundSize: '100px', 
        }}
      />
      <Grid item xs={1} />
      <Grid item xs={6}>
        <Box sx={{ pt: 4 }}>
          {isMobile ? <MobileGame /> : (
            gameComplete ? <></> :
            <Game 
              onWin={(score: number, team: number) => setGameComplete(true) } 
              onSkip={() => setGameComplete(true)}
            />
          )}
        </Box>
        <Box sx={{ mt: 12, mb: 4, textAlign: "center" }}>
          <Typography variant="h6" color="gray">
            inspired by <a href="https://cxmi.itch.io/" style={{ color: "gray" }}>christine mi</a>'s games
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={1}
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/bulbasaur.webp)`, 
          backgroundRepeat: 'repeat',
          backgroundSize: '100px', 
        }}
      />
    </Grid>
  )
}

export default MainView;  