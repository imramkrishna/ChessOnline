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
        <div className="min-h-screen w-full bg-[#e8e5e0] relative">
            {/* Subtle background texture */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-black/[0.03] to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-black/[0.03] to-transparent rounded-full blur-3xl"></div>
                {/* Decorative chess pieces - faded */}
                <div className="absolute top-16 right-16 text-7xl text-black/[0.04] select-none hidden lg:block">♚</div>
                <div className="absolute bottom-20 left-16 text-6xl text-black/[0.04] select-none hidden lg:block rotate-12">♟</div>
                <div className="absolute top-1/3 right-1/4 text-5xl text-black/[0.03] select-none hidden lg:block -rotate-12">♞</div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">♚</span>
                    <span className="text-xl font-bold text-[#1a1a1a] tracking-tight">ChessOnline</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm text-[#555] font-medium">
                    <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">About</span>
                    <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">Community</span>
                    <a href="https://ramkrishnacode.tech" target='_blank' className="hover:text-[#1a1a1a] cursor-pointer transition-colors">Contact</a>
                </div>
            </nav>

            <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 pb-16">
                <div className="max-w-6xl w-full">
                    {/* Hero Section — Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0 items-center">
                            {/* Left — Chess Board Visual */}
                            <div className="relative flex items-center justify-center p-8 sm:p-12 lg:p-16 order-2 lg:order-1">
                                <div className="relative">
                                    {/* Glow behind board */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl blur-2xl scale-110"></div>
                                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-white rounded-2xl shadow-[0_12px_50px_rgba(0,0,0,0.12)] p-3 sm:p-4">
                                        {/* Chess board pattern */}
                                        <div className="grid grid-cols-8 gap-0 w-full h-full rounded-xl overflow-hidden">
                                            {Array.from({ length: 64 }, (_, i) => {
                                                const row = Math.floor(i / 8);
                                                const col = i % 8;
                                                const isLight = (row + col) % 2 === 0;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`${isLight ? 'bg-[#f0f0f0]' : 'bg-[#1a1a1a]'
                                                            } flex items-center justify-center text-lg sm:text-xl md:text-2xl`}
                                                    >
                                                        <span className={isLight ? 'text-[#1a1a1a]' : 'text-[#f0f0f0]'}>
                                                            {i === 0 && '♜'}
                                                            {i === 7 && '♜'}
                                                            {i === 56 && '♖'}
                                                            {i === 63 && '♖'}
                                                            {i === 3 && '♛'}
                                                            {i === 59 && '♕'}
                                                            {i === 1 && '♞'}
                                                            {i === 6 && '♞'}
                                                            {i === 57 && '♘'}
                                                            {i === 62 && '♘'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Content */}
                            <div className="p-8 sm:p-12 lg:p-16 order-1 lg:order-2">
                                <div className="mb-2">
                                    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#555] bg-black/[0.04] rounded-full">
                                        Multiplayer
                                    </span>
                                </div>
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a1a1a] leading-[0.9] tracking-tight mb-1">
                                    CHESS
                                </h1>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light italic text-[#c84032] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                    Game
                                </h2>
                                <p className="text-[#666] text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                                    Real-time multiplayer chess with private rooms, move history, and game timers. Play against friends or random opponents.
                                </p>

                                {/* Action Buttons */}
                                <div className="space-y-3 space-x-2"> 
                                    <button
                                        onClick={handleJoinRoom}
                                        className="group w-full sm:w-auto bg-[#1a1a1a] hover:bg-[#333] text-white text-sm font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                                    >
                                        <div className="relative flex items-center justify-center space-x-2">
                                            <span>Play Online</span>
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={handlePrivateRoomClick}
                                        className="group w-full sm:w-auto bg-transparent hover:bg-black/[0.04] text-[#1a1a1a] text-sm font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 border border-black/15 hover:border-black/30"
                                    >
                                        <div className="relative flex items-center justify-center space-x-2">
                                            <span>Private Room</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-8 mt-10 pt-8 border-t border-black/[0.06]">
                                    <div>
                                        <div className="text-2xl font-bold text-[#1a1a1a]">1,234</div>
                                        <div className="text-xs text-[#888] font-medium uppercase tracking-wider">Players</div>
                                    </div>
                                    <div className="w-px h-10 bg-black/[0.08]"></div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#1a1a1a]">567</div>
                                        <div className="text-xs text-[#888] font-medium uppercase tracking-wider">Active Games</div>
                                    </div>
                                    <div className="w-px h-10 bg-black/[0.08]"></div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#1a1a1a]">24/7</div>
                                        <div className="text-xs text-[#888] font-medium uppercase tracking-wider">Online</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Row */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        {[
                            { icon: '⚡', title: 'Real-time', desc: 'Instant multiplayer' },
                            { icon: '♟', title: 'Standard Rules', desc: 'Full chess ruleset' },
                            { icon: '📋', title: 'Move History', desc: 'Track every move' },
                            { icon: '⏱', title: 'Game Timer', desc: 'Timed matches' },
                        ].map((f, i) => (
                            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-black/[0.04] hover:bg-white/80 hover:shadow-md transition-all duration-300">
                                <div className="text-2xl mb-2">{f.icon}</div>
                                <div className="text-sm font-semibold text-[#1a1a1a] mb-0.5">{f.title}</div>
                                <div className="text-xs text-[#888]">{f.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-10">
                        <p className="text-[#999] text-xs">
                            Crafted by{' '}
                            <a
                                href="https://iamramkrishna.com"
                                target='_blank'
                                className="text-[#1a1a1a] hover:text-[#c84032] transition-colors font-medium"
                            >
                                Ram Krishna
                            </a>
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