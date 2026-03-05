import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const DummyTab = () => {
  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure your dinosaur panel preferences and game settings.
      </Typography>

      <Card sx={{ bgcolor: '#1e1e1e' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Settings panel coming soon. This will include preferences for notifications,
            data refresh intervals, and other customization options.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DummyTab;
