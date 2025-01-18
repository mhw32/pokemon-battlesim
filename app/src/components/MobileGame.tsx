import { Box, Button, Typography } from "@mui/material";
import toast from 'react-hot-toast';

const MobileGame = () => {
  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ 
        backgroundColor: "#e9c46a",
        width: "100%",
        height: 300,
        margin: "0 auto",
        borderRadius: 4,
      }}
    >
      <Button 
        style={{
          borderRadius: 4,
          backgroundColor: "white",
        }}
        sx={{ m: 2, p: 2 }}
        onClick={() => {
          toast.error("Hey! This game is not available on mobile. Please play on a computer.");
        }}
      >
        <Typography style={{ color: "black" }}>
          Unavailable on mobile
        </Typography>
      </Button>
    </Box>
  );
}

export default MobileGame;