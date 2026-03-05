import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  LinearProgress,
  Grid,
  Chip,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { getDinoData, performAction } from '../services/dinoService';

const StatBar = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100;
  
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}/{max}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#2a2a2a',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4
          }
        }}
      />
    </Box>
  );
};

const DinoTab = () => {
  const [dinoData, setDinoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('PARK');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dino = await getDinoData();
      setDinoData(dino);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;
    
    setActionLoading(true);
    try {
      const updatedDino = await performAction(selectedAction);
      setDinoData(updatedDino);
      setNotification({
        type: 'success',
        message: `Action "${selectedAction}" executed successfully!`
      });
      
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to execute action.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Live Dino
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your current active dinosaur with all its stats.
        </Typography>
      </Box>

      {notification && (
        <Alert severity={notification.type} sx={{ mb: 1.5 }} onClose={() => setNotification(null)}>
          {notification.message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ height: 'calc(100% - 100px)' }}>
     
        {/* Middle Column - Stats */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', minWidth: '70%' }}>
          <Card sx={{ bgcolor: '#1e1e1e', height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {dinoData.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dinoData.species} • Level {dinoData.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Last update: {new Date(dinoData.lastUpdate).toLocaleTimeString()}
                  </Typography>
             
              <Typography variant="h6" sx={{ mb: 2 }}>
                Stats
              </Typography>
              
              {/* Stats Bars */}
              <StatBar 
                label="Health" 
                value={dinoData.stats.health} 
                max={dinoData.stats.maxHealth}
                color="#4caf50"
              />
              <StatBar 
                label="Stamina" 
                value={dinoData.stats.stamina} 
                max={dinoData.stats.maxStamina}
                color="#2196f3"
              />
              <StatBar 
                label="Food" 
                value={dinoData.stats.food} 
                max={dinoData.stats.maxFood}
                color="#ff9800"
              />
              <StatBar 
                label="Thirst" 
                value={dinoData.stats.thirst} 
                max={dinoData.stats.maxThirst}
                color="#00bcd4"
              />

              <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Prime Status 
              </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, bgcolor: '#2a2a2a', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Visited sanctuary
                      </Typography>
                      <Typography variant="h6" color="#f44336">
                       False
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, bgcolor: '#2a2a2a', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Migration Zones Visited
                      </Typography>
                      <Typography variant="h6" color="#f44336">
                        0
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default DinoTab;
