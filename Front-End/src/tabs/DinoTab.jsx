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
        {/* Left Column - Dino Image and Info */}
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Card sx={{ bgcolor: '#1e1e1e', height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6">
                  Your Dinosaur
                </Typography>
                <Chip 
                  label={dinoData.status} 
                  color={dinoData.status === 'WAITING' ? 'warning' : 'success'}
                  size="small"
                />
              </Box>
              
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Last update: {new Date(dinoData.lastUpdate).toLocaleTimeString()}
                </Typography>
              </Box>

              {/* Dinosaur Image */}
              <Paper 
                sx={{ 
                  height: 350,
                  bgcolor: '#0a0a0a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: `url(${dinoData.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    p: 1,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {dinoData.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dinoData.species} • Level {dinoData.level}
                  </Typography>
                </Box>
                {dinoData.status === 'WAITING' && (
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#fff',
                      textShadow: '0 0 10px rgba(0,0,0,0.8)',
                      position: 'absolute'
                    }}
                  >
                    Waiting for data...
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column - Stats */}
        <Grid item xs={12} sm={12} md={5} lg={5}>
          <Card sx={{ bgcolor: '#1e1e1e', height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
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
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Attributes
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, bgcolor: '#2a2a2a', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Attack
                      </Typography>
                      <Typography variant="h6" color="#f44336">
                        {dinoData.attributes.attack}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, bgcolor: '#2a2a2a', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Defense
                      </Typography>
                      <Typography variant="h6" color="#2196f3">
                        {dinoData.attributes.defense}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, bgcolor: '#2a2a2a', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Speed
                      </Typography>
                      <Typography variant="h6" color="#4caf50">
                        {dinoData.attributes.speed}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Actions */}
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Card sx={{ bgcolor: '#1e1e1e', height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Pick an action, then confirm.
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Action
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Button
                  variant={selectedAction === 'PARK' ? 'contained' : 'outlined'}
                  onClick={() => handleActionSelect('PARK')}
                  fullWidth
                  sx={{
                    bgcolor: selectedAction === 'PARK' ? '#1b4d3e' : 'transparent',
                    borderColor: '#1b4d3e',
                    '&:hover': {
                      bgcolor: '#1b4d3e'
                    }
                  }}
                >
                  PARK
                </Button>
                <Button
                  variant={selectedAction === 'PRIME' ? 'contained' : 'outlined'}
                  onClick={() => handleActionSelect('PRIME')}
                  fullWidth
                  sx={{
                    bgcolor: selectedAction === 'PRIME' ? '#1b4d3e' : 'transparent',
                    borderColor: '#1b4d3e',
                    '&:hover': {
                      bgcolor: '#1b4d3e'
                    }
                  }}
                >
                  PRIME
                </Button>
                <Button
                  variant={selectedAction === 'SLAY' ? 'contained' : 'outlined'}
                  onClick={() => handleActionSelect('SLAY')}
                  fullWidth
                  sx={{
                    bgcolor: selectedAction === 'SLAY' ? '#1b4d3e' : 'transparent',
                    borderColor: '#1b4d3e',
                    '&:hover': {
                      bgcolor: '#1b4d3e'
                    }
                  }}
                >
                  SLAY
                </Button>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleConfirm}
                disabled={actionLoading || !selectedAction}
                sx={{
                  bgcolor: '#1b4d3e',
                  py: 1.5,
                  mb: 1.5,
                  '&:hover': {
                    bgcolor: '#2a7056'
                  },
                  '&:disabled': {
                    bgcolor: '#0a0a0a'
                  }
                }}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'CONFIRM'}
              </Button>

              {selectedAction === 'PARK' && (
                <Box sx={{ p: 1.5, bgcolor: '#0a0a0a', borderRadius: 1, mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Park will store your dinosaur (Requires 100% Health & 75% Growth).
                  </Typography>
                </Box>
              )}

              {selectedAction === 'PRIME' && (
                <Box sx={{ p: 1.5, bgcolor: '#0a0a0a', borderRadius: 1, mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Prime will prepare your dinosaur for battle.
                  </Typography>
                </Box>
              )}

              {selectedAction === 'SLAY' && (
                <Box sx={{ p: 1.5, bgcolor: '#0a0a0a', borderRadius: 1, mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Slay will eliminate your dinosaur permanently.
                  </Typography>
                </Box>
              )}

              <Box sx={{ p: 1.5, bgcolor: '#0a0a0a', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Info
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Select the action you want to take and use the button to execute it.
                  Actions <strong>cannot</strong> be undone after confirming.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DinoTab;
