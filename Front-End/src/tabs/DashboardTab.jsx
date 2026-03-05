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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1e1e1e' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Total Dinosaurs
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1e1e1e' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Active Dinosaur
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                Rex
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#1e1e1e' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip label="WAITING" color="warning" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Stats
        </Typography>
        <Paper sx={{ p: 3, bgcolor: '#1e1e1e' }}>
          <Typography variant="body2" color="text.secondary">
            View comprehensive statistics about your dinosaurs, actions, and game progress.
            This section will be populated with real data from DynamoDB.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardTab;
