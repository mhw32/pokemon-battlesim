import { Box, Grid } from "@mui/material";

type InputProps = {
  isActive: boolean[];
  isOpponent: boolean;
  numTotal: number;
}

const Pokeballs = ({ isActive, isOpponent, numTotal }: InputProps) => {
  const getImage = (index: number) => {
    if (index >= isActive.length) {
      return <img src={`${process.env.PUBLIC_URL}/pokeball/ball-empty.png`} height={30} alt="empty pokeball" />
    } else if (isActive[index]) {
      return <img src={`${process.env.PUBLIC_URL}/pokeball/ball-alive.png`} height={30} alt="alive pokeball" />
    } else {
      return <img src={`${process.env.PUBLIC_URL}/pokeball/ball-dead.png`} height={30} alt="dead pokeball" />
    }
  }
  let indices: number[] = [];
  for (let i = 0; i < numTotal; i++) {
    if (isOpponent) {
      indices.push(numTotal - i - 1);
    } else {
      indices.push(i);
    }
  }
  if (isOpponent) {
    return (
      <Box
        sx={{
          px: 2,
          borderBottom: '8px solid black', // Bottom border
          borderLeft: '8px solid black',  // Right border
        }}
      >
        <Grid container spacing={1}>
          {indices.map((x, i) => <Grid item key={`grid-item-${i}`}>{getImage(x)}</Grid>)}
        </Grid>
      </Box>  
    );
  } else {
    return (
      <Box
        sx={{
          px: 2,
          borderBottom: '8px solid black', // Bottom border
          borderRight: '8px solid black',  // Right border
        }}
      >
        <Grid container spacing={1}>
          {indices.map((x, i) => <Grid item key={`grid-item-${i}`}>{getImage(x)}</Grid>)}
        </Grid>
      </Box>  
    );
  }
}

export default Pokeballs;