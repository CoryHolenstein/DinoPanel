# API Integration Guide

This document provides step-by-step instructions for connecting the Dino Panel to your backend services (DynamoDB, WebSocket, Steam Auth).

## Current State

The app currently uses **dummy data** for all operations. To enable real functionality, you'll need to:

1. Set up backend infrastructure (API Gateway, Lambda, DynamoDB)
2. Implement Steam OAuth backend
3. Update service files to make real API calls
4. Configure WebSocket for real-time updates

---

## Part 1: DynamoDB Setup

### 1.1 Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name dino-game-data \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=dinoId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=dinoId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 1.2 Table Schema

```json
{
  "userId": "steam_76561198012345678",
  "dinoId": "dino_12345",
  "name": "Rex",
  "species": "Tyrannosaurus",
  "level": 47,
  "status": "WAITING",
  "stats": {
    "health": 85,
    "stamina": 62,
    "food": 45,
    "thirst": 73,
    "maxHealth": 100,
    "maxStamina": 100,
    "maxFood": 100,
    "maxThirst": 100
  },
  "attributes": {
    "attack": 342,
    "defense": 287,
    "speed": 156
  },
  "location": "The Isle Evrima",
  "lastUpdate": "2026-03-04T12:00:00Z"
}
```

---

## Part 2: API Gateway & Lambda Functions

### 2.1 Create Lambda Function for Getting Dino Data

**Function Name**: `getDinoData`

```javascript
// getDinoData Lambda
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = event.pathParameters.userId;
  
  const params = {
    TableName: 'dino-game-data',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    Limit: 1 // Get the active dino
  };
  
  try {
    const result = await dynamodb.query(params).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Items[0] || null)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2.2 Create Lambda for Performing Actions

**Function Name**: `performDinoAction`

```javascript
// performDinoAction Lambda
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { userId, dinoId, action } = body;
  
  const params = {
    TableName: 'dino-game-data',
    Key: { userId, dinoId },
    UpdateExpression: 'SET #status = :status, lastUpdate = :timestamp',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': action.toUpperCase(),
      ':timestamp': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };
  
  try {
    const result = await dynamodb.update(params).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2.3 Create API Gateway REST API

```bash
# Create REST API
aws apigateway create-rest-api \
  --name dino-panel-api \
  --description "API for Dino Panel"

# Create /dino resource
# Create GET method on /dino/{userId}
# Create POST method on /dino/action
# Deploy to 'prod' stage
```

---

## Part 3: Update Frontend Services

### 3.1 Update `dinoService.js`

Replace the dummy service with real API calls:

```javascript
const API_URL = process.env.REACT_APP_API_URL;

export const getDinoData = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/dino/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dino data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dino data:', error);
    throw error;
  }
};

export const performAction = async (userId, dinoId, action) => {
  try {
    const response = await fetch(`${API_URL}/dino/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        dinoId,
        action
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to perform action');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error performing action:', error);
    throw error;
  }
};

export const getPlayerStats = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/player/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch player stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
};
```

---

## Part 4: Steam Authentication Backend

### 4.1 Setup Node.js Backend with Passport

**Install dependencies**:
```bash
npm install express passport passport-steam express-session
```

**Backend server** (`server.js`):
```javascript
const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const session = require('express-session');

const app = express();

passport.use(new SteamStrategy({
    returnURL: process.env.STEAM_RETURN_URL,
    realm: process.env.REALM,
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Steam login route
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

// Steam return route
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication
    res.redirect(`${process.env.FRONTEND_URL}?auth=success&steamId=${req.user.id}`);
  }
);

// Get current user
app.get('/auth/user', (req, res) => {
  if (req.user) {
    res.json({
      steamId: req.user.id,
      personaName: req.user.displayName,
      avatar: req.user.photos[2].value,
      profileUrl: req.user._json.profileurl
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

app.listen(3001, () => {
  console.log('Auth server running on port 3001');
});
```

### 4.2 Update `AuthContext.jsx`

```javascript
const loginWithSteam = () => {
  // Redirect to backend Steam auth
  window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/steam`;
};

const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
};
```

---

## Part 5: WebSocket Integration (Real-time Updates)

### 5.1 Create WebSocket API Gateway

```bash
# Create WebSocket API
aws apigatewayv2 create-api \
  --name dino-panel-websocket \
  --protocol-type WEBSOCKET \
  --route-selection-expression '$request.body.action'
```

### 5.2 WebSocket Lambda Handler

```javascript
const AWS = require('aws-sdk');
const apiGateway = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WEBSOCKET_ENDPOINT
});

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;
  
  if (routeKey === '$connect') {
    // Store connection in DynamoDB
    // Associate with userId
    return { statusCode: 200 };
  }
  
  if (routeKey === '$disconnect') {
    // Remove connection from DynamoDB
    return { statusCode: 200 };
  }
  
  // Handle messages
  return { statusCode: 200 };
};
```

### 5.3 Update Frontend to Use WebSocket

**Create `src/hooks/useWebSocket.js`**:
```javascript
import { useEffect, useState } from 'react';

export const useWebSocket = (userId) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const websocket = new WebSocket(process.env.REACT_APP_WS_URL);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      websocket.send(JSON.stringify({ action: 'subscribe', userId }));
    };
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, [userId]);
  
  return { ws, data };
};
```

**Use in `DinoTab.jsx`**:
```javascript
import { useWebSocket } from '../hooks/useWebSocket';

const DinoTab = () => {
  const { user } = useAuth();
  const { data: wsData } = useWebSocket(user?.steamId);
  
  useEffect(() => {
    if (wsData) {
      setDinoData(wsData);
    }
  }, [wsData]);
  
  // Rest of component...
};
```

---

## Part 6: Environment Configuration

Create `.env` file:
```env
REACT_APP_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_WS_URL=wss://xyz789.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_BACKEND_URL=https://your-auth-backend.com
REACT_APP_STEAM_RETURN_URL=https://your-auth-backend.com/auth/steam/return
```

---

## Testing Checklist

- [ ] DynamoDB table created and accessible
- [ ] Lambda functions deployed and working
- [ ] API Gateway configured with CORS
- [ ] Steam authentication backend running
- [ ] Frontend can fetch real dino data
- [ ] Actions can be performed and saved
- [ ] WebSocket sends real-time updates
- [ ] Authentication persists across page reloads

---

## Deployment

Once everything is configured:

```bash
# Build production version
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

## Need Help?

- Check CloudWatch Logs for Lambda errors
- Use API Gateway test console to debug endpoints
- Enable CORS on all API Gateway methods
- Ensure IAM roles have proper permissions for Lambda to access DynamoDB
