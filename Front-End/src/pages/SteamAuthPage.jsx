import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SteamAuthPage = () => {
  const navigate = useNavigate();
  const { loginWithSteam } = useAuth();

  const handleSignIn = () => {
    // Simulate Steam login
    loginWithSteam();
    // Redirect to main app
    navigate('/app');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#171a21',
      }}
    >
      <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#1b2838', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#fff' }}>
          Steam Sign In
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#8f98a0' }}>
          (Dummy IDP Page - Will redirect to actual Steam in production)
        </Typography>
        <Button
          variant="contained"
          onClick={handleSignIn}
          sx={{
            bgcolor: '#5c7e10',
            '&:hover': { bgcolor: '#79a81d' },
            px: 4,
            py: 1.5,
          }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default SteamAuthPage;
