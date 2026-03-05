import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Grid } from '@mui/material';

const dinoList = [
  { id: 1, name: 'Rex', species: 'Tyrannosaurus', level: 47, status: 'Active' },
  { id: 2, name: 'BlueClaw', species: 'Velociraptor', level: 32, status: 'Parked' },
  { id: 3, name: 'Spike', species: 'Stegosaurus', level: 28, status: 'Parked' },
  { id: 4, name: 'Thunder', species: 'Brachiosaurus', level: 41, status: 'Parked' },
  { id: 5, name: 'Shadow', species: 'Carnotaurus', level: 35, status: 'Parked' },
];

const DinosTab = () => {
  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Dinosaurs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View all your dinosaurs and switch between them.
      </Typography>

      <Grid container spacing={2}>
        {dinoList.map((dino) => (
          <Grid item xs={12} md={6} key={dino.id}>
            <Card 
              sx={{ 
                bgcolor: dino.status === 'Active' ? '#1b4d3e' : '#1e1e1e',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: dino.status === 'Active' ? '#2a7056' : '#2a2a2a'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: '#f4d03f' }}>
                    {dino.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {dino.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dino.species} • Level {dino.level}
                    </Typography>
                  </Box>
                  {dino.status === 'Active' && (
                    <Typography variant="caption" sx={{ color: '#4caf50' }}>
                      ● Active
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DinosTab;
