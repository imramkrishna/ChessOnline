import React from 'react'

const Home = () => {
    const handleJoinRoom = () => {
        // Add your join room logic here
        console.log('Joining room...');
    }

    const handleCreateRoom = () => {
        // Add your create room logic here
        console.log('Creating room...');
    }

    return (
        <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
            <div className="max-w-6xl w-full h-full flex flex-col justify-center">
                {/* Header - More compact */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 tracking-tight">
                        Chess<span className="text-purple-400">Online</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Challenge players worldwide in real-time chess battles
                    </p>
                </div>

                {/* Main Content - Optimized spacing */}
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center flex-1">
                    {/* Left Side - Chess Board Icon */}
                    <div className="flex justify-center order-2 lg:order-1">
                        <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-amber-100 rounded-2xl shadow-2xl p-3 md:p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            {/* Chess board pattern */}
                            <div className="grid grid-cols-8 gap-0 w-full h-full rounded-lg overflow-hidden">
                                {Array.from({ length: 64 }, (_, i) => {
                                    const row = Math.floor(i / 8);
                                    const col = i % 8;
                                    const isLight = (row + col) % 2 === 0;
                                    return (
                                        <div
                                            key={i}
                                            className={`${isLight ? 'bg-amber-50' : 'bg-amber-800'
                                                } flex items-center justify-center text-lg sm:text-xl md:text-2xl`}
                                        >
                                            {/* Add chess pieces for visual appeal */}
                                            {i === 0 && '♜'}
                                            {i === 7 && '♜'}
                                            {i === 56 && '♖'}
                                            {i === 63 && '♖'}
                                            {i === 28 && '♛'}
                                            {i === 35 && '♕'}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Game Options */}
                    <div className="space-y-4 order-1 lg:order-2">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/20">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">Ready to Play?</h2>

                            {/* Join Room Button */}
                            <button
                                onClick={handleJoinRoom}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg lg:text-xl font-semibold py-3 lg:py-4 px-6 lg:px-8 rounded-xl mb-3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                            >
                                🎮 Join Random Game
                            </button>

                            {/* Create Room Button */}
                            <button
                                onClick={handleCreateRoom}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg lg:text-xl font-semibold py-3 lg:py-4 px-6 lg:px-8 rounded-xl mb-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                            >
                                🏰 Create Private Room
                            </button>

                            {/* Game Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                                <div className="text-center">
                                    <div className="text-xl lg:text-2xl font-bold text-purple-400">1,234</div>
                                    <div className="text-xs lg:text-sm text-gray-300">Online Players</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl lg:text-2xl font-bold text-emerald-400">567</div>
                                    <div className="text-xs lg:text-sm text-gray-300">Active Games</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info - More compact */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/10">
                            <h3 className="text-base lg:text-lg font-semibold text-white mb-3">How to Play</h3>
                            <ul className="text-gray-300 space-y-1 text-xs lg:text-sm">
                                <li>• Join random game or create private room</li>
                                <li>• Standard chess rules apply</li>
                                <li>• Real-time multiplayer battles</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer - More compact */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        Built with ❤️ for chess enthusiasts worldwide
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home