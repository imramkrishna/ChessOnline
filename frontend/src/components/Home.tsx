import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';
import PrivateRoomModal from './Room/PrivateRoomModal';
import JoinRoomModal from './Room/JoinRoomModal';
import WaitingForOpponentModal from './Room/WaitingForOpponentModal';
import { CREATE_ROOM, JOIN_ROOM, ROOM_CREATED, ROOM_JOINED } from '../messages';
const Home = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [showPrivateRoomModal, setShowPrivateRoomModal] = useState(false);
    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
    const [showWaitingModal, setShowWaitingModal] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState('');

    const handleJoinRoom = () => {
        navigate("/game");
    }

    const handlePrivateRoomClick = () => {
        setShowPrivateRoomModal(true);
    };

    const handleCreateRoom = () => {
        // Generate a random room ID
        setShowPrivateRoomModal(false);
        setShowWaitingModal(true);
        socket?.send(JSON.stringify({ type: CREATE_ROOM }));     
    };

    const handleJoinRoomClick = () => {
        setShowPrivateRoomModal(false);
        setShowJoinRoomModal(true);
    };

    const handleJoinWithRoomId = (roomId: string) => {
        setShowJoinRoomModal(false);
        socket?.send(JSON.stringify({ type: JOIN_ROOM, roomID: roomId }));
    };

    const handleCancelWaiting = () => {
        setShowWaitingModal(false);
        setCurrentRoomId('');
        // TODO: Send cancel room request to backend
        // socket?.send(JSON.stringify({ type: 'CANCEL_PRIVATE_ROOM', roomId: currentRoomId }));
    };
    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case ROOM_CREATED:
                    setCurrentRoomId(message.roomID);
                    setShowWaitingModal(true);
                    break;
                case ROOM_JOINED:
                    console.log(`ROOM JOINED CASE WORKING RIGHT NOW`);
                    console.log("Message payload: ",message.payload)
                    setShowWaitingModal(false);
                    setCurrentRoomId('');
                    navigate("/private-game", { state: { roomId: message.roomID, isPrivate: true,message } });
                    break;    
                default:
                    break;
            }
        }
    },[socket])

    return (
        <div className="min-h-screen w-full bg-[#121212] relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#BB86FC]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#03DAC6]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 lg:mb-4 tracking-tight">
                            Chess<span className="bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] bg-clip-text text-transparent">Online</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            Experience the ultimate chess battle platform with real-time multiplayer gameplay
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Side - Enhanced Chess Board */}
                        <div className="flex justify-center order-2 lg:order-1">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-[#1E1E1E] rounded-2xl shadow-2xl p-4 lg:p-6 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
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
                            <div className="bg-[#1E1E1E] backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-[#BB86FC]/30 shadow-2xl hover:bg-[#252525] transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="w-3 h-3 bg-[#03DAC6] rounded-full mr-3 animate-pulse"></div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white">Ready to Play?</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Join Random Game Button */}
                                    <button
                                        onClick={handleJoinRoom}
                                        className="group w-full bg-[#BB86FC] hover:bg-[#BB86FC]/80 text-[#121212] text-lg lg:text-xl font-semibold py-4 lg:py-5 px-6 lg:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-3">
                                            <span className="text-2xl">🎮</span>
                                            <span>Join Random Game</span>
                                        </div>
                                    </button>

                                    {/* Create Private Room Button */}
                                    <button
                                        onClick={handlePrivateRoomClick}
                                        className="group w-full bg-[#03DAC6] hover:bg-[#03DAC6]/80 text-[#121212] text-lg lg:text-xl font-semibold py-4 lg:py-5 px-6 lg:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-3">
                                            <span className="text-2xl">🏰</span>
                                            <span>Private Room</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Game Statistics */}
                                <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-[#BB86FC]/20">
                                    <div className="text-center group">
                                        <div className="text-2xl lg:text-3xl font-bold text-[#BB86FC] group-hover:text-[#BB86FC]/80 transition-colors">
                                            1,234
                                        </div>
                                        <div className="text-sm text-white/70 mt-1">Online Players</div>
                                    </div>
                                    <div className="text-center group">
                                        <div className="text-2xl lg:text-3xl font-bold text-[#03DAC6] group-hover:text-[#03DAC6]/80 transition-colors">
                                            567
                                        </div>
                                        <div className="text-sm text-white/70 mt-1">Active Games</div>
                                    </div>
                                </div>
                            </div>

                            {/* Game Features */}
                            <div className="bg-[#1E1E1E] backdrop-blur-lg rounded-2xl p-6 border border-[#BB86FC]/30 hover:bg-[#252525] transition-all duration-300">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <span className="text-2xl mr-2">✨</span>
                                    Game Features
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center text-white/80">
                                        <span className="text-[#03DAC6] mr-2">✓</span>
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
                        <p className="text-white/60 text-sm lg:text-base">
                            Crafted with ❤️ by{' '}
                            <a
                                href="https://ramkrishnacode.tech"
                                target='_blank'
                                className="text-[#BB86FC] hover:text-[#03DAC6] transition-colors font-semibold"
                            >
                                Ram Krishna
                            </a>
                            {' '}for chess enthusiasts worldwide
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PrivateRoomModal
                isOpen={showPrivateRoomModal}
                onClose={() => setShowPrivateRoomModal(false)}
                onCreateRoom={handleCreateRoom}
                onJoinRoom={handleJoinRoomClick}
            />

            <JoinRoomModal
                isOpen={showJoinRoomModal}
                onClose={() => setShowJoinRoomModal(false)}
                socket={socket}
                onJoin={handleJoinWithRoomId}
            />

            <WaitingForOpponentModal
                isOpen={showWaitingModal}
                roomId={currentRoomId}
                onCancel={handleCancelWaiting}
              
            />
        </div>
    )
}

export default Home