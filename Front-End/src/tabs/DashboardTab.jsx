import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Paper } from '@mui/material';

const DashboardTab = () => {
  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Overview of your dinosaur management panel.
      </Typography>

    </Box>
  );
};

export default DashboardTab;
