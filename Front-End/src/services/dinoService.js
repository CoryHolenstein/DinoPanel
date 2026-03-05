// Dummy data service for dinosaur game
// In production, this will make API calls to DynamoDB via API Gateway

export const dummyDinoData = {
  id: 'dino_12345',
  name: 'Rex',
  species: 'Tyrannosaurus',
  level: 47,
  status: 'WAITING',
  stats: {
    health: 85,
    stamina: 62,
    food: 45,
    thirst: 73,
    maxHealth: 100,
    maxStamina: 100,
    maxFood: 100,
    maxThirst: 100
  },
  attributes: {
    attack: 342,
    defense: 287,
    speed: 156
  },
  location: 'The Isle Evrima',
  lastUpdate: new Date().toISOString(),
  imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=300&fit=crop'
};

export const getDinoData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production:
  // const response = await fetch(`YOUR_API_GATEWAY_URL/dino/${userId}`);
  // return response.json();
  
  return dummyDinoData;
};

export const performAction = async (action) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production:
  // const response = await fetch(`YOUR_API_GATEWAY_URL/dino/action`, {
  //   method: 'POST',
  //   body: JSON.stringify({ action })
  // });
  // return response.json();
  
  console.log(`Performed action: ${action}`);
  
  // Return updated dino data
  return {
    ...dummyDinoData,
    status: action.toUpperCase(),
    lastUpdate: new Date().toISOString()
  };
};

export const getPlayerStats = async () => {
  // Dummy player stats
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    clanCoins: 589882,
    amberShards: 1875,
    totalDinos: 5,
    activeDino: dummyDinoData.id
  };
};
