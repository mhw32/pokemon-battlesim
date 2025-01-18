import React from 'react';
import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import MainView from './components/MainView';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Box>
        <CssBaseline />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: "black",
              color: "#EEEDEB",
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/"
              element={
                <MainView />
              }
            />
          </Routes>
        </BrowserRouter>
      </Box>
    </div>
  );
}

export default App;
