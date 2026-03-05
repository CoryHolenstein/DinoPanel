# Dino Panel - The Isle Evrima Community Dashboard

A real-time dashboard for managing your dinosaur in The Isle Evrima game. This panel provides a comprehensive interface to monitor your dinosaur's stats, perform actions, and manage your dino collection.

## Features

### 🦖 Live Dino Monitoring
- Real-time stats display (Health, Stamina, Food, Thirst)
- Dinosaur attributes (Attack, Defense, Speed)
- Visual stat bars with color coding
- Current status tracking (WAITING, PARK, PRIME, SLAY)

### 🎮 Action Management
- **PARK**: Store your dinosaur (Requires 100% Health & 75% Growth)
- **PRIME**: Prepare your dinosaur for battle
- **SLAY**: Eliminate your dinosaur permanently
- Confirmation system to prevent accidental actions

### 🔐 Steam Authentication
- Seamless Steam OAuth integration
- User profile display with avatar
- Persistent session management

### 📊 Dashboard & Navigation
- Multiple tabs: Dashboard, Live Dino, My Dinosaurs, Settings
- Sidebar navigation with icons
- Dark theme optimized for gaming
- Responsive design

## Tech Stack

- **Frontend**: React 19
- **UI Framework**: Material-UI (MUI)
- **Styling**: Emotion CSS-in-JS
- **State Management**: React Hooks
- **Authentication**: Steam OpenID (simulated in dev)

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- Steam API credentials (for production)
- AWS Account with DynamoDB access (for production)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dino-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Development Mode

Currently, the app runs with **dummy data** for easy development and testing. All API calls are simulated with the following dummy services:

### Dummy Data Services

**DinoService** (`src/services/dinoService.js`):
- `getDinoData()`: Returns mock dinosaur data
- `performAction(action)`: Simulates action execution
- `getPlayerStats()`: Returns mock player statistics

**AuthContext** (`src/contexts/AuthContext.jsx`):
- `loginWithSteam()`: Simulates Steam OAuth flow
- Stores user session in localStorage

## Production Setup

### Steam Authentication

To enable real Steam authentication:

1. Register your application at [Steamworks](https://partner.steamgames.com/)
2. Get your Steam Web API Key
3. Set up a backend server to handle OAuth:

```javascript
// Backend pseudo-code
app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return', 
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);
```

4. Update `AuthContext.jsx` to redirect to your backend:
```javascript
const loginWithSteam = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/auth/steam`;
};
```

### DynamoDB Integration

To connect to real game data:

1. Set up DynamoDB table with schema:
```json
{
  "userId": "STRING (Partition Key)",
  "dinoId": "STRING (Sort Key)",
  "name": "STRING",
  "species": "STRING",
  "stats": {
    "health": "NUMBER",
    "stamina": "NUMBER",
    "food": "NUMBER",
    "thirst": "NUMBER"
  },
  "status": "STRING",
  "lastUpdate": "STRING (ISO Date)"
}
```

2. Create API Gateway endpoints for:
   - `GET /dino/{userId}` - Fetch dino data
   - `POST /dino/action` - Perform actions
   - `GET /player/{userId}` - Get player stats

3. Update `dinoService.js` to make real API calls:
```javascript
export const getDinoData = async () => {
  const response = await fetch(`${API_URL}/dino/${userId}`);
  return response.json();
};
```

### WebSocket Integration

For real-time game data updates:

1. Set up AWS API Gateway WebSocket API
2. Create connection handler Lambda function
3. Update the app to connect to WebSocket:

```javascript
const ws = new WebSocket(process.env.REACT_APP_WS_URL);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setDinoData(data);
};
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
REACT_APP_WS_URL=wss://your-websocket-url.execute-api.region.amazonaws.com/prod
REACT_APP_STEAM_RETURN_URL=https://your-domain.com/auth/callback
```

## Project Structure

```
dino-panel/
├── public/
├── src/
│   ├── components/
│   │   └── AppBar.jsx          # Top navigation bar with Steam auth
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context provider
│   ├── pages/
│   │   └── HomePage.jsx        # Main layout with sidebar navigation
│   ├── services/
│   │   └── dinoService.js      # API service for dino data
│   ├── tabs/
│   │   ├── DashboardTab.jsx    # Overview dashboard
│   │   ├── DinoTab.jsx         # Live dino monitoring
│   │   ├── DinosTab.jsx        # All dinosaurs list
│   │   └── DummyTab.jsx        # Settings placeholder
│   ├── App.js                  # Root component with theme
│   └── index.js                # Entry point
└── package.json
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to CloudFront + S3

1. Create S3 bucket and enable static website hosting
2. Create CloudFront distribution pointing to S3
3. Upload build files:

```bash
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Deploy with AWS Amplify

```bash
amplify init
amplify add hosting
amplify publish
```

## Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Multiple dinosaur switching
- [ ] Historical stats and analytics
- [ ] Action history log
- [ ] Notifications system
- [ ] Mobile app version
- [ ] Dinosaur comparison tool
- [ ] Leaderboard integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for The Dino Den Community


### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
