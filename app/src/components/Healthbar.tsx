import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";

type InputProps = {
  name: string;
  level: number;
  curHealth: number;
  maxHealth: number;
  isOpponent: boolean;
  colorDelay?: number;
}

/**
 * Healthbar component
 * @param name - The name of the pokemon
 * @param level - The level of the pokemon
 * @param curHealth - The current health of the pokemon
 * @param maxHealth - The maximum health of the pokemon
 * @param isOpponent - Whether the pokemon is an opponent
 * @param colorDelay - The delay before the color changes
 * @returns 
 */
const Healthbar = ({ 
  name, 
  level, 
  curHealth, 
  maxHealth, 
  isOpponent, 
  colorDelay = 1.5, 
}: InputProps) => {
  const [barColor, setBarColor] = useState<string>("#1bc323");

  /**
   * Effect to change the color of the healthbar
   */
  useEffect(() => {
    if (curHealth === maxHealth) {
      setBarColor("#1bc323");  // Update the color to green immediately
    } else {
      const healthRatio = curHealth / maxHealth;
      let newColor = "#1bc323";
      if (healthRatio <= 0.2) {
        newColor = "#cd0036";
      } else if ((curHealth / maxHealth) <= 0.5) {
        newColor = "#e4734d";
      } 
      const colorTimeout = setTimeout(() => setBarColor(newColor), colorDelay * 1000);
      return () => clearTimeout(colorTimeout);
    }
  }, [curHealth, maxHealth, colorDelay]);
  
  const getHealthBarWidth = () => {
    if (curHealth === 0) {
      return 0;
    }
    const width = (150 * curHealth) / maxHealth - 4;
    return Math.max(6, width);
  }

  return (
    <Box>
      <Typography style={{ fontWeight: "bold", fontSize: 24 }}> 
        {name.toUpperCase()}
      </Typography>
      <Typography style={{ fontWeight: "bold", fontSize: 22 }} sx={{ pl: 8 }}> 
        :L{level} 
      </Typography>
      <Box
        sx={{
          px: 2,
          borderBottom: '8px solid black', // Bottom border
          borderRight: isOpponent ? '0px solid black' : '8px solid black',  // Right border
          borderLeft: isOpponent ? '8px solid black' : '0px solid black',  // Right border
        }}
      >
        <Grid container spacing={1} sx={{
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
          <Grid item>
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}> 
              HP:
            </Typography>
          </Grid>
          <Grid item>
            <Box
              sx={{
                position: 'relative', // Set the parent to relative
                width: 150, // Ensures both boxes have the same width
                height: 10, // Same height for the container
              }}
            >
              <Box
                sx={{
                  borderRadius: 10, 
                  border: '3px solid black',
                  height: 10,
                  width: '100%',  // Make it take full width
                }}
              />
              <Box
                sx={{
                  borderRadius: 10, 
                  backgroundColor: barColor,
                  position: 'absolute', // Position it absolute to overlap
                  top: 0,               // Align to the top of the parent
                  left: 0,              // Align to the left of the parent
                  height: 6,
                  width: `${getHealthBarWidth()}px`, // Dynamic width
                  transition: 'width 1s ease-in-out 1s', // Add transition for smooth width animation
                }}
                style={{
                  marginTop: 2,
                  marginLeft: 2,
                }}
              />
            </Box>
          </Grid>
        </Grid>
        {!isOpponent && (<Box sx={{ pl: 6 }}>
          <Typography style={{ fontWeight: "bold", fontSize: 24 }}> 
            {curHealth} / {maxHealth}
          </Typography>
        </Box>)}
      </Box>  
    </Box>
  );
}

export default Healthbar;