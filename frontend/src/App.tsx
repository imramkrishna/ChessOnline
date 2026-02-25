import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Game from "./components/Game"
import PrivateGame from "./components/PrivateGame"
function App() {
  return (
    <div className="min-h-screen w-full bg-[#e8e5e0]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/private-game" element={<PrivateGame />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
