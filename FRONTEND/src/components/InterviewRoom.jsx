import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_URL } from '@/utils/constant';
import axios from 'axios';

// Ensure the backend URL matches the environment
const SOCKET_URL = 'http://localhost:8000'; // Change this if deployed

function InterviewRoom() {
    const { id: applicationId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [socket, setSocket] = useState(null);
    const [roomLink, setRoomLink] = useState(null);

    // To prevent strict mode double emission
    const hasEmittedRef = useRef(false);

    useEffect(() => {
        // Find application to get the link (in a real app, you'd fetch this from the backend if not in state)
        // Here we just use the application ID as the room name for simplicity if link is not available,
        // but ideally we fetch the application details to get the exact link/room ID.
        setRoomLink(applicationId); // Using applicationId as the unique room identifier

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join_interview_room', applicationId);
        });

        newSocket.on('proctoring_alert', (data) => {
            if (user?.role === 'recruiter') {
                toast.error(`Proctoring Alert: Candidate changed window!`);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [applicationId, user]);

    useEffect(() => {
        if (!socket || user?.role === 'recruiter') return;

        const handleVisibilityChange = async () => {
            if (document.hidden) {
                console.log("Candidate changed tab!");
                socket.emit('proctoring_violation_client', { 
                    roomId: applicationId, 
                    applicationId,
                    message: "User switched tabs or minimized window."
                });

                // Also notify the backend directly to update the DB
                try {
                    await axios.post(`${APPLICATION_URL}/${applicationId}/proctoring-violation`, {}, {
                        withCredentials: true
                    });
                } catch (error) {
                    console.error("Failed to record proctoring violation", error);
                }
            }
        };

        const handleBlur = async () => {
             console.log("Window lost focus!");
             socket.emit('proctoring_violation_client', { 
                 roomId: applicationId, 
                 applicationId,
                 message: "User clicked outside the window."
             });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [socket, user, applicationId]);

    return (
        <div className="h-screen w-screen flex flex-col bg-[#0f172a] text-white font-sans overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-[#1e293b]/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center shadow-lg relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">JobBazaar Live Interview</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    {user?.role === 'recruiter' && (
                        <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full border border-red-500/20 text-sm">
                            <span className="font-semibold">Proctoring Active</span>
                        </div>
                    )}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-red-500 hover:bg-red-600 transition-colors px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-red-500/20 flex items-center gap-2"
                    >
                        End Session
                    </button>
                </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 w-full h-full flex p-4 gap-4 relative z-0">
                {/* Video Call Container */}
                <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black relative">
                    {roomLink ? (
                        <JitsiMeeting
                            roomName={`JobBazaar-Interview-${roomLink}`}
                            configOverwrite={{
                                startWithAudioMuted: false,
                                startWithVideoMuted: false,
                                disableModeratorIndicator: true,
                                enableEmailInStats: false,
                                prejoinPageEnabled: false,
                            }}
                            interfaceConfigOverwrite={{
                                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                                HIDE_INVITE_MORE_HEADER: true,
                            }}
                            userInfo={{
                                displayName: user?.fullname || 'Guest'
                            }}
                            getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; }}
                            onReadyToClose={() => navigate(-1)}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:flex w-80 bg-[#1e293b]/60 backdrop-blur-lg border border-white/5 rounded-2xl p-5 flex-col gap-4 shadow-xl">
                    <h2 className="text-lg font-semibold border-b border-white/10 pb-2">Session Info</h2>
                    
                    <div className="flex-1 overflow-y-auto">
                        {user?.role === 'recruiter' ? (
                            <div className="space-y-4">
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                    <h3 className="text-blue-400 font-medium text-sm mb-1">Candidate Monitor</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Anti-cheat proctoring is currently monitoring the candidate's window. You will be alerted here if they switch tabs.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                    <h3 className="text-yellow-400 font-medium text-sm mb-1">⚠️ Important</h3>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        This interview is proctored. Switching tabs or minimizing the browser window will notify the recruiter and may result in disqualification.
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4">
                                    <h3 className="text-gray-200 font-medium text-sm mb-2">Tips</h3>
                                    <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                                        <li>Ensure a quiet environment.</li>
                                        <li>Check your camera and microphone.</li>
                                        <li>Speak clearly and confidently.</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewRoom;
