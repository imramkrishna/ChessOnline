# ♟️ ChessOnline

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A real-time multiplayer chess platform with WebSocket communication, featuring private rooms, draw negotiations, and a professional glass-morphism UI**

[🎮 Live Demo](https://chess-online-five.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/imramkrishna/ChessOnline/issues) • [✨ Request Feature](https://github.com/imramkrishna/ChessOnline/issues)

</div>

---

## 📸 Screenshots

<!-- Add screenshot here -->
<div align="center">
  <img src="https://via.placeholder.com/800x450/1e293b/ffffff?text=Main+Menu" alt="Main Menu" width="800"/>
  <p><em>Elegant home screen with random matchmaking and private room options</em></p>
</div>

<!-- Add screenshot here -->
<div align="center">
  <img src="https://via.placeholder.com/800x450/1e293b/ffffff?text=Live+Chess+Game" alt="Live Game" width="800"/>
  <p><em>Real-time gameplay with move validation and history tracking</em></p>
</div>

<!-- Add screenshot here -->
<div align="center">
  <img src="https://via.placeholder.com/400x650/1e293b/ffffff?text=Mobile+View" alt="Mobile View" width="400"/>
  <p><em>Fully responsive - playable on mobile, tablet, and desktop</em></p>
</div>

---

## ✨ Key Features

### 🎮 Core Gameplay
- **Real-time Multiplayer** - Instant move synchronization using WebSocket technology
- **Move Validation** - Powered by chess.js library ensuring only legal moves are allowed
- **Move History Tracking** - Complete game record with timestamps and move notation
- **Live Game Timer** - Real-time game duration tracking
- **Turn Indicators** - Clear visual indicators showing whose turn it is

### 🏰 Game Modes
- **Random Matchmaking** - Join public games instantly with automatic opponent pairing
- **Private Rooms** - Create custom rooms with unique 6-character IDs
- **Room Sharing** - Share room codes with friends via one-click copy-to-clipboard
- **Waiting Room** - Visual waiting lobby when room is created

### 🎯 Game Actions
- **Resign System** - Forfeit the game gracefully with animated confirmation
- **Draw Offers** - Propose draws to opponents mid-game
- **Draw Negotiation** - Interactive accept/reject system for draw proposals
- **Pending Draw UI** - Visual indicator when draw offer is pending opponent response
- **Victory/Defeat Overlays** - Beautiful animated result screens with blur effects

### 🎨 Modern UI/UX
- **Fully Responsive Design** - Optimized for mobile (320px+), tablet, and desktop
- **Glass-morphism Effects** - Modern frosted-glass UI components with backdrop blur
- **Smooth Animations** - Powered by Framer Motion for fluid transitions
- **Interactive Board** - Visual feedback for legal moves, captures, and selections
- **Dark Theme** - Eye-friendly gradient design with purple/slate color scheme
- **Touch-Optimized** - Large tap targets and gesture-friendly on mobile devices

### 🔧 Technical Features
- **WebSocket Singleton Pattern** - Single persistent connection shared across components
- **State Management** - Efficient React hooks-based state management
- **Type Safety** - Full TypeScript implementation on both frontend and backend
- **Error Handling** - Graceful error handling with user-friendly messages
- **Modular Architecture** - Clean separation of concerns with reusable components

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.1.0 with TypeScript 5.8.3
- **Styling:** Tailwind CSS 4.1 with custom glass-morphism utilities
- **Routing:** React Router DOM 7.6
- **Animations:** Framer Motion 12.23
- **Chess Logic:** chess.js 1.4.0
- **HTTP Client:** Axios 1.10
- **Build Tool:** Vite 7.0
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js with TypeScript
- **WebSocket:** ws 8.18 (native WebSocket library)
- **Chess Engine:** chess.js 1.4.0
- **Caching/Storage:** Redis 5.5 & Upstash Redis 1.35
- **Type Checking:** TypeScript with strict mode

### Development Tools
- **Linting:** ESLint 9.29 with React hooks plugin
- **Type Definitions:** @types/ws, @types/react, @types/react-dom
- **Code Quality:** TypeScript strict mode, ESLint rules

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Redis (for backend caching - optional but recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/imramkrishna/ChessOnline.git
cd ChessOnline
```

### 2. Backend Setup
```bash
cd backend1

# Install dependencies
npm install

# Create .env file (optional - for production)
# Add Redis configuration if using
echo "REDIS_URL=your_redis_url" > .env

# Build and run
npm run dev
```

The backend will start on `http://localhost:3000` (WebSocket server).

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_WS_URL=ws://localhost:3000" > .env

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 4. Open in Browser
Navigate to `http://localhost:5173` and start playing!

---

## 🚀 Usage

### Starting a Random Game
1. Click **"Join Random Game"** on the home screen
2. Wait for an opponent to connect (automatic matchmaking)
3. Game starts automatically when both players are ready

### Creating a Private Room
1. Click **"Private Room"** button
2. Select **"Create New Room"**
3. Copy the generated 6-character room ID
4. Share the room ID with your friend
5. Wait for opponent to join

### Joining a Private Room
1. Click **"Private Room"** button
2. Select **"Join Room"**
3. Enter the room ID shared by your friend
4. Click **"Join Room"** to start playing

### Game Controls
- **Move Pieces:** Click piece → Click destination square
- **Legal Moves:** Green highlights show legal destinations
- **Resign:** Click resign button to forfeit the game
- **Offer Draw:** Click draw button to propose a draw
- **Accept/Reject Draw:** Respond to opponent's draw offer

---

## 📁 Project Structure

```
ChessOnline/
├── backend1/                  # Backend WebSocket server
│   ├── src/
│   │   ├── Game.ts           # Chess game logic and state management
│   │   ├── GameManager.ts    # Manages multiple game instances
│   │   ├── index.ts          # WebSocket server entry point
│   │   ├── messages.ts       # Message type constants
│   │   └── utils/
│   │       ├── generatePrivateKey.ts  # Room ID generation
│   │       └── types.ts      # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChessBoard.tsx           # Interactive chess board
│   │   │   ├── Game.tsx                 # Random game component
│   │   │   ├── PrivateGame.tsx          # Private room game component
│   │   │   ├── Home.tsx                 # Landing page
│   │   │   ├── VictoryMessage.tsx       # Win overlay
│   │   │   ├── DefeatMessage.tsx        # Loss overlay
│   │   │   ├── OfferDrawMessage.tsx     # Draw offer modal
│   │   │   ├── DrawResultMessage.tsx    # Draw result overlay
│   │   │   ├── PendingDrawMessage.tsx   # Pending draw indicator
│   │   │   └── Room/
│   │   │       ├── PrivateRoomModal.tsx      # Create/Join modal
│   │   │       ├── JoinRoomModal.tsx         # Room ID input
│   │   │       └── WaitingForOpponentModal.tsx  # Waiting lobby
│   │   ├── hooks/
│   │   │   └── useSocket.ts             # WebSocket singleton hook
│   │   ├── messages.ts                  # Message type constants
│   │   ├── App.tsx                      # Main app with routing
│   │   └── main.tsx                     # React entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
└── README.md
```

---

## 🔌 WebSocket API Documentation

### Client → Server Messages

#### 1. Initialize Random Game
```typescript
{
  type: "init_game"
}
```
**Response:** Server assigns color and starts game when opponent joins.

#### 2. Create Private Room
```typescript
{
  type: "create_room",
  roomId: "ABC123"  // 6-character room ID
}
```
**Response:**
```typescript
{
  type: "room_created",
  payload: { roomId: "ABC123" }
}
```

#### 3. Join Private Room
```typescript
{
  type: "join_room",
  roomId: "ABC123"
}
```
**Response:**
```typescript
{
  type: "room_joined",
  payload: { color: "white" | "black" }
}
```

#### 4. Make a Move
```typescript
{
  type: "move",
  payload: {
    move: {
      from: "e2",  // Starting square
      to: "e4"     // Destination square
    }
  }
}
```
**Response:**
```typescript
{
  type: "move",
  board: "fen_notation_string",
  AllMoves: [/* move history */],
  payload: { /* move details */ }
}
```

#### 5. Resign
```typescript
{
  type: "resign"
}
```
**Response:** Opponent receives victory message.

#### 6. Offer Draw
```typescript
{
  type: "offering_draw"
}
```

#### 7. Accept Draw
```typescript
{
  type: "draw_accepted"
}
```

#### 8. Reject Draw
```typescript
{
  type: "draw_rejected"
}
```

### Server → Client Messages

#### Game Start
```typescript
{
  type: "init_game",
  payload: {
    color: "white" | "black"
  }
}
```

#### Move Update
```typescript
{
  type: "move",
  board: "fen_string",
  AllMoves: Array<{
    player: WebSocket,
    moveTime: Date,
    move: { from: string, to: string }
  }>,
  payload: { /* move info */ }
}
```

#### Game Over
```typescript
{
  type: "game_over"
}
```

#### Opponent Resigned
```typescript
{
  type: "resign"
}
```

#### Draw Offered
```typescript
{
  type: "offering_draw"
}
```

#### Draw Accepted
```typescript
{
  type: "drawed"
}
```

#### Draw Rejected
```typescript
{
  type: "draw_rejected"
}
```

#### Error
```typescript
{
  type: "error",
  message: "Error description"
}
```

---

## 🏗️ Architecture Overview

### WebSocket Singleton Pattern
The application uses a singleton WebSocket connection shared across all components:

```typescript
// useSocket.ts
let globalSocket: WebSocket | null = null;

export const useSocket = () => {
  // Returns same socket instance across all components
  // Ensures only ONE connection to server
}
```

**Benefits:**
- Single persistent connection (efficient)
- Shared message handling across components
- Survives navigation between routes
- Automatic reconnection logic in one place

### State Management Flow
```
User Action → Component State Update → WebSocket Send
                                              ↓
Backend Processing ← Game Logic ← Message Received
        ↓
Server Broadcast → WebSocket Receive → State Update → UI Re-render
```

### Component Architecture
- **Presentational Components:** VictoryMessage, DefeatMessage, Modals
- **Container Components:** Game, PrivateGame, Home
- **Hooks:** useSocket for WebSocket management
- **Utilities:** Message type constants, type definitions

---

## 🎨 Styling Guide

### Color Palette
- **Primary Background:** Gradient from slate-900 → purple-900 → slate-900
- **Glass Panels:** white/10 with backdrop-blur
- **Accents:** Purple-400, Pink-400, Emerald-500, Cyan-500
- **Board Colors:** Amber-100 (light squares), Amber-800 (dark squares)

### Responsive Breakpoints
- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (sm - lg)
- **Desktop:** > 1024px (lg, xl)

### Animation Standards
- **Duration:** 300-500ms for UI elements
- **Easing:** easeOut for entrances, easeIn for exits
- **Scale:** 1.02-1.05 for hover effects

---

## 🚧 Troubleshooting

### WebSocket Connection Issues

**Problem:** "Socket not available" error
```bash
# Check if backend is running
cd backend1
npm run dev

# Verify WebSocket URL in frontend/.env
VITE_WS_URL=ws://localhost:3000
```

**Problem:** Connection refused
- Ensure backend is running on port 3000
- Check firewall settings
- Verify WebSocket URL protocol (ws:// not wss:// for local)

### Game Not Starting

**Problem:** Stuck on "Waiting for opponent"
- Ensure both players are connected
- Check browser console for WebSocket errors
- Try refreshing both clients

### Move Validation Errors

**Problem:** Valid moves not showing
- Ensure chess.js is properly initialized
- Check console for game state errors
- Verify move notation format (e.g., "e2" → "e4")

### Mobile Display Issues

**Problem:** Board not fitting on mobile
- Clear browser cache
- Check viewport meta tag in index.html
- Ensure latest version of frontend is deployed

---

## 🛣️ Roadmap

### Version 2.0 (Planned)
- [ ] User authentication and profiles
- [ ] ELO rating system
- [ ] Match history and statistics
- [ ] Spectator mode
- [ ] Chat system
- [ ] Time controls (blitz, rapid, classical)
- [ ] Game analysis engine
- [ ] Replay saved games

### Version 2.1 (Future)
- [ ] Tournament system
- [ ] Friend list and challenges
- [ ] Puzzle rush mode
- [ ] AI opponent (Stockfish integration)
- [ ] Mobile native apps (React Native)
- [ ] Multiple board themes
- [ ] Sound effects and notifications

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ChessOnline.git
   cd ChessOnline
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

5. **Commit Your Changes**
   ```bash
   git commit -m "Add some AmazingFeature"
   ```

6. **Push to Your Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Describe your changes in detail

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain responsive design standards
- Add comments for complex logic
- Test on multiple devices/browsers
- Update documentation if needed
- Keep commits atomic and well-described

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components
- Use meaningful variable names

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 👤 Author

**Ram Krishna Yadav**

- Website: [ramkrishnacode.tech](https://ramkrishnacode.tech)
- GitHub: [@imramkrishna](https://github.com/imramkrishna)
- LinkedIn: [Ram Krishna Yadav](https://linkedin.com/in/ramkrishnayadav)
- Portfolio: [ramkrishnacode.tech](https://ramkrishnacode.tech)

---

## 🙏 Acknowledgments

### Libraries & Frameworks
- **[chess.js](https://github.com/jhlywa/chess.js)** - Chess logic and move validation
- **[React](https://react.dev/)** - UI framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[ws](https://github.com/websockets/ws)** - WebSocket implementation

### Inspiration
- Inspired by chess platforms like Chess.com and Lichess
- UI design influenced by modern glass-morphism trends
- Learning project to master WebSocket real-time communication

### Special Thanks
- Chess community for game rules and best practices
- Open-source contributors for amazing libraries
- Beta testers for valuable feedback

---

## 📊 Project Statistics

- **Total Lines of Code:** ~3,000+
- **Components:** 15+ React components
- **Languages:** TypeScript (100%)
- **Development Time:** 2-3 weeks
- **Performance:** < 100ms move latency

---

## 🎓 Learning Outcomes

Building this project taught me:
- WebSocket protocol and real-time bi-directional communication
- Singleton pattern for resource management
- Complex state management in React
- Responsive design across multiple device sizes
- TypeScript type safety and generics
- Glass-morphism UI design trends
- Game state synchronization challenges

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/imramkrishna/ChessOnline/issues)
3. Create a new issue with detailed description
4. Contact via [email](mailto:your-email@example.com)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you learn or if you enjoyed playing chess on it!

---

<div align="center">

**Made with ❤️ by Ram Krishna Yadav**

[⬆ Back to Top](#-chessonline)

</div>
