# 🔥 Firebase Setup Instructions for Math Puzzle Game

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `math-puzzle-game`
4. Click "Continue"
5. Choose your default Google Analytics account (or skip)
6. Click "Create project"

## Step 2: Get Firebase Configuration

1. In your Firebase project dashboard, click the Web icon (`</>`)
2. Enter app nickname: `Math Puzzle Game`
3. Click "Register app"
4. Copy the Firebase configuration object
5. Replace the dummy config in `script.js` with your real config

## Step 3: Setup Realtime Database

1. In Firebase dashboard, go to "Realtime Database" (left sidebar)
2. Click "Create Database"
3. Choose location: Select a location near your users
4. Start in **test mode** (allows read/write access)
5. Click "Enable"

## Step 4: Update Security Rules (Important!)

Go to Realtime Database → Rules tab and replace with:

```json
{
  "rules": {
    "scores": {
      ".read": true,
      ".write": true,
      ".indexOn": ["score", "timestamp"]
    }
  }
}
```

## Step 5: Replace Dummy Config

In `script.js`, replace this:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForDemo",
    authDomain: "math-puzzle-game.firebaseapp.com",
    databaseURL: "https://math-puzzle-game-default-rtdb.firebaseio.com",
    projectId: "math-puzzle-game",
    storageBucket: "math-puzzle-game.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

With your actual Firebase config from Step 2.

## ✅ Features After Setup

- **Real-time cross-device sync** - Scores sync instantly across all devices
- **Live leaderboard** - See other players' scores in real-time
- **Device identification** - Each device gets unique ID
- **Top 50 global scores** - Maintains best scores globally
- **Offline fallback** - Works even when offline, syncs when online

## 🎮 Test It

1. Open game on two different devices/browsers
2. Play and get a high score on device 1
3. Open MAX button on device 2
4. You should see the score appear in "Global Top Scores (Live)"

## 🔒 Security Notes

- The current rules allow anyone to read/write scores
- For production, consider adding user authentication
- You can add rate limiting to prevent spam scores

## 💰 Cost

- Firebase Spark Plan: **FREE**
- 1GB storage, 10GB/month data transfer
- More than enough for this game

## 🚀 Ready to Go!

Once you complete these steps, your game will have:
- ✅ Real cross-device score sharing
- ✅ Live global leaderboard  
- ✅ Automatic score synchronization
- ✅ No server maintenance needed

Enjoy your global math puzzle competition! 🏆
