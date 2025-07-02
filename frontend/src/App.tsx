import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Game from "./components/Game"
function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
