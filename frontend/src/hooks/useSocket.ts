import { useEffect, useState } from "react"

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000"

// ✨ THIS IS THE KEY - Module-level variable (shared across all imports)
let globalSocket: WebSocket | null = null;

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(globalSocket);

    useEffect(() => {
        // If socket already exists globally, reuse it
        if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
            console.log("♻️ Reusing existing WebSocket connection");
            setSocket(globalSocket);
            return;
        }

        // Only create NEW socket if none exists
        if (!globalSocket || globalSocket.readyState === WebSocket.CLOSED) {
            console.log("🔌 Creating new WebSocket connection");
            const ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log("✅ WebSocket connected");
                globalSocket = ws;  // Store in module-level variable
                setSocket(ws);
            };

            ws.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
            };

            ws.onclose = () => {
                console.log("🔌 WebSocket disconnected");
                globalSocket = null;  // Clear global reference
                setSocket(null);
            };

            // Cleanup function - but DON'T close the global socket
            return () => {
                // Only close if this component created it AND it's the last user
                // Usually we keep it alive for other components
            };
        }
    }, []);

    return socket;
}