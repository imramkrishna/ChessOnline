import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        navigate("/game")
    }

    const handleCreateRoom = () => {
        // Add create room functionality
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 lg:mb-4 tracking-tight">
                            Chess<span className="text-purple-400 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Online</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Experience the ultimate chess battle platform with real-time multiplayer gameplay
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Side - Enhanced Chess Board */}
                        <div className="flex justify-center order-2 lg:order-1">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-2xl p-4 lg:p-6 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                                    {/* Chess board pattern */}
                                    <div className="grid grid-cols-8 gap-0 w-full h-full rounded-xl overflow-hidden shadow-inner">
                                        {Array.from({ length: 64 }, (_, i) => {
                                            const row = Math.floor(i / 8);
                                            const col = i % 8;
                                            const isLight = (row + col) % 2 === 0;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`${isLight ? 'bg-amber-50' : 'bg-amber-800'
                                                        } flex items-center justify-center text-xl sm:text-2xl md:text-3xl transition-all duration-300 hover:bg-opacity-80`}
                                                >
                                                    {i === 0 && '♜'}
                                                    {i === 7 && '♜'}
                                                    {i === 56 && '♖'}
                                                    {i === 63 && '♖'}
                                                    {i === 28 && '♛'}
                                                    {i === 35 && '♕'}
                                                    {i === 12 && '♞'}
                                                    {i === 51 && '♘'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Game Options */}
                        <div className="space-y-6 order-1 lg:order-2">
                            {/* Main Game Card */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white">Ready to Play?</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Join Random Game Button */}
                                    <button
                                        onClick={handleJoinRoom}
                                        className="group w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white text-lg lg:text-xl font-semibold py-4 lg:py-5 px-6 lg:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-3">
                                            <span className="text-2xl">🎮</span>
                                            <span>Join Random Game</span>
                                        </div>
                                    </button>

                                    {/* Create Private Room Button */}
                                    <button
                                        onClick={handleCreateRoom}
                                        className="group w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white text-lg lg:text-xl font-semibold py-4 lg:py-5 px-6 lg:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-3">
                                            <span className="text-2xl">🏰</span>
                                            <span>Create Private Room</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Game Statistics */}
                                <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/20">
                                    <div className="text-center group">
                                        <div className="text-2xl lg:text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                                            1,234
                                        </div>
                                        <div className="text-sm text-gray-300 mt-1">Online Players</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="text-2xl lg:text-3xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                            567
                                        </div>
                                        <div className="text-sm text-gray-300 mt-1">Active Games</div>
                                    </div>
                                </div>
                            </div>

                            {/* Game Features */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <span className="text-2xl mr-2">✨</span>
                                    Game Features
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center text-gray-300">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Real-time multiplayer
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Standard chess rules
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Move history tracking
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <span className="text-green-400 mr-2">✓</span>
                                        Game timer support
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 lg:mt-16">
                        <p className="text-gray-400 text-sm lg:text-base">
                            Crafted with ❤️ by{' '}
                            <a
                                href="https://ramkrishnacode.tech"
                                target='_blank'
                                className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                            >
                                Ram Krishna
                            </a>
                            {' '}for chess enthusiasts worldwide
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home