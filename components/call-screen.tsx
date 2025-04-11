"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface CallScreenProps {
  user: User;
  callType: "audio" | "video";
  open: boolean;
  onClose: () => void;
}

export function CallScreen({ user, callType, open, onClose }: CallScreenProps) {
   const { data: session, status } = useSession();
   const [userId, setUserId] = useState<string | undefined>(undefined);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(callType === "video");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [enableRemoteVideo, setEnableRemoteVideo] = useState(callType === "video");
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [checkSession, setCheckSession] = useState(false);
  // console.log("session", session);
  // console.log("id",session?.user.id)
  // console.log("userId",userId)
  useEffect(() => {
    if (status === "authenticated") {
      console.log("session", session);
      setUserId(session?.user.id);
    }
  }, [status, session]);
  const getUserMedia = async () => {
    console.log("getUserMedia");
   
    // Yêu cầu quyền truy cập dựa vào user
    if (user.id == "67f5484b513be7879f3d86fc") {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      console.log("Getting media with constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      // Log tracks sau khi lấy được stream
      console.log("Got media stream:", {
        tracks: mediaStream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          muted: t.muted,
        })),
      });

      streamRef.current = mediaStream;

      // Set local video chỉ khi là user1 và có camera
      if (localVideoRef.current && cameraEnabled) {
        localVideoRef.current.srcObject = mediaStream;
      }

      // Add tracks vào PeerConnection
      mediaStream.getTracks().forEach((track) => {
        const sender = peerConnectionRef.current!.addTrack(track, mediaStream);
        console.log("Track added, sender:", sender);
      });

      // Kiểm tra số lượng senders
      const senders = peerConnectionRef.current!.getSenders();
      console.log("Total senders:", senders.length);
    }
  };

  useEffect(() => {
    
    if(!checkSession && userId ){
      console.log("userId22", userId);
      setCheckSession(true);
      // 1. Khởi tạo PeerConnection
      const configuration = {
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
          {
            urls: "turn:relay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
        iceTransportPolicy: "all",
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
        // Thêm các tùy chọn để tăng khả năng tương thích
        iceCandidatePoolSize: 10,
      };

      peerConnectionRef.current = new RTCPeerConnection(
        configuration as RTCConfiguration
      );

      // 2. Khởi tạo Socket
      const socket = io("http://localhost:8080", {
        transports: ["websocket"],
      });
      // 3. ICE candidate handler
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("User1 found ICE candidate:", event.candidate);
          socket.emit("candidate", {
            senderId: userId,
            recipientId: user.id,
            candidate: event.candidate,
          });
        } else {
          console.log(
            "User1 ICE gathering completed, candidates in SDP:",
            peerConnectionRef.current?.localDescription?.sdp.includes(
              "a=candidate"
            )
          );
        }
      };

      peerConnectionRef.current.addEventListener(
        "connectionstatechange",
        async () => {
          console.log(
            "Connection state:",
            peerConnectionRef.current?.connectionState
          );
          if (peerConnectionRef.current?.connectionState === "connected") {
            const stats = await peerConnectionRef.current?.getStats();
            stats.forEach((report) => {
              if (report.type === "outbound-rtp" && report.kind === "audio") {
                console.log("✅ Audio track is being sent:", report);
              }
            });
          }
        }
      );

      peerConnectionRef.current.onicegatheringstatechange = () => {
        console.log(
          "ICE Gathering State:",
          peerConnectionRef.current?.iceGatheringState
        );
      };

      peerConnectionRef.current.onsignalingstatechange = () => {
        console.log(
          "Signaling State:",
          peerConnectionRef.current?.signalingState
        );
      };
      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log(
          "Connection state changed:",
          peerConnectionRef.current?.connectionState
        );
      };

      peerConnectionRef.current.oniceconnectionstatechange = () => {
        console.log(
          "ICE connection state:",
          peerConnectionRef.current?.iceConnectionState
        );
      };

      // Thêm log cho tracks và set remote stream
      peerConnectionRef.current.ontrack = (event) => {
        console.log("Track received:", {
          kind: event.track.kind,
          streamId: event.streams[0]?.id,
          trackId: event.track.id,
        });

        if (!event.streams[0]) return;
        console.log("event.streams", event.streams);
        event.track.onmute = () => {
          console.log("Remote video đã tắt");
        };

        event.track.onunmute = () => {
          console.log("Remote video đã bật");
        };
        if (event.track.kind === "audio") {
          console.log("Setting remote audio stream...", event.streams[0]);
          remoteAudioRef.current!.srcObject = event.streams[0];
        }
        if (event.track.kind === "video") {
          console.log("Setting remote video stream...", event.streams[0]);
          remoteVideoRef.current!.srcObject = event.streams[0];
        }
      };
      // 4. Lấy media và khởi tạo call
      const initializeCall = async () => {
        try {
          console.log("initializeCall", user.id);
          if (user.id == "67f5484b513be7879f3d86fc") {
            await getUserMedia();
            console.log("Creating offer...");
            const offer = await peerConnectionRef.current!.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
              iceRestart: true,
            });
            console.log("offer", offer);

            // Set local description
            await peerConnectionRef.current!.setLocalDescription(offer);
            // Đợi 2 giây để đảm bảo quá trình khởi tạo hoàn tất
            await new Promise((resolve) => setTimeout(resolve, 2000));

            socket.emit("offer", {
              senderId: userId,
              recipientId: user.id,
              offer: peerConnectionRef.current!.localDescription,
            });
          }
        } catch (error) {
          console.error("Error in initializeCall:", error);
        }
      };

      // 1. Tách riêng việc xử lý candidate
      const processIceCandidate = async (candidate: RTCIceCandidate) => {
        try {
          if (peerConnectionRef.current?.remoteDescription) {
            // Nếu đã có remote description thì add candidate ngay
            await peerConnectionRef.current.addIceCandidate(candidate);
            console.log("Added ICE candidate");
          } else {
            // Nếu chưa có remote description thì queue lại
            console.log("Queueing ICE candidate");
            pendingCandidatesRef.current.push(candidate);
          }
        } catch (error) {
          console.error("Error processing ICE candidate:", error);
        }
      };

      // 2. Socket listeners
      console.log("socket", socket);
      socket.on("offer", async (data) => {
        if (data.recipientId !== userId) return;
        console.log("✅ offer user 1:", data.offer.sdp);

        try {
          // Sau đó mới set remote description và tạo answer
          await peerConnectionRef.current!.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          const answer = await peerConnectionRef.current!.createAnswer();
          await peerConnectionRef.current!.setLocalDescription(answer);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("answer", answer.sdp);
          socket.emit("answer", {
            senderId: userId,
            recipientId: data.senderId,
            answer: answer,
          });
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      });

      socket.on("answer", async (data) => {
        if (data.recipientId !== userId) return;
        console.log("✅ User1 nhận answer từ user2:", data);

        if (!peerConnectionRef.current) {
          console.error("PeerConnection chưa được khởi tạo!");
          return;
        }

        try {
          // 1. Thiết lập remote description (answer từ user2)
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));

          console.log("🔄 User1 đã setRemoteDescription thành công");
          // Kiểm tra trạng thái ICE
          console.log(
            "ICE Gathering State sau khi nhận answer:",
            peerConnectionRef.current!.iceGatheringState
          );

          // 2. Xử lý các ICE candidates đã nhận trước đó (nếu có)
          if (pendingCandidatesRef.current.length > 0) {
            console.log(
              `📦 User1 xử lý ${pendingCandidatesRef.current.length} candidates đang chờ...`
            );
            for (const candidate of pendingCandidatesRef.current) {
              try {
                await peerConnectionRef.current.addIceCandidate(candidate);
                console.log("➕ User1 thêm candidate từ user2:", candidate);
              } catch (err) {
                console.error("❌ User1 không thể thêm candidate:", err);
              }
            }
            pendingCandidatesRef.current = []; // Xóa hàng đợi
          }

          // 3. Kích hoạt gửi ICE candidates (nếu chưa tự động)
          if (peerConnectionRef.current.iceGatheringState === "gathering") {
            console.log("🚀 User1 bắt đầu gửi ICE candidates cho user2");
          }
        } catch (error) {
          console.error("❌ User1 xử lý answer thất bại:", error);
        }
      });

      socket.on("candidate", async (data) => {
        if (data.recipientId !== user.id) return;
        console.log("Received ICE candidate from:", data.senderId);
        await processIceCandidate(data.candidate);
      });

      socket.on("enable-video", async (data) => {
        console.log("enable-video", data);
        if (data.recipientId !== userId) return;
        setEnableRemoteVideo(data.enable);
      });
      socket.on("end-call", async (data) => {
        if (data.recipientId !== user.id) return;
        endCall();
      });
      setSocket(socket);
      if (open && userId) {
        initializeCall();
      }
      // 6. Cleanup
      return () => {
        // if (!checkSession) {
        //   if (streamRef.current) {
        //     streamRef.current.getTracks().forEach((track) => track.stop());
        //   }
        //   if (peerConnectionRef.current) {
        //     peerConnectionRef.current.close();
        //   }
        //   socket?.disconnect();
        // }
      };
    }
  }, [user, open,status, session]);
  
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
      }
    }
    setMicEnabled(!micEnabled);
  };

  const toggleCamera = () => {
    socket?.emit("enable-video", {
      senderId: userId,
      recipientId: user.id,
      enable: !cameraEnabled,
    });
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
      }
    }
    setCameraEnabled(!cameraEnabled);
  };
  const endCall = () => {
    // 1. Dừng camera/mic
    streamRef.current?.getTracks().forEach((track) => track.stop());

    // 2. Đóng peer connection
    peerConnectionRef.current?.close();

    // 3. Xoá stream khỏi video
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // 4. (tuỳ chọn) chuyển trang
    onClose();
  };

  useEffect(() => {
    const checkVideoStream = () => {
      if (remoteVideoRef.current?.srcObject) {
        const stream = remoteVideoRef.current.srcObject as MediaStream;
        console.log("Video stream check:", {
          active: stream.active,
          videoTracks: stream.getVideoTracks().map((track) => ({
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState,
            settings: track.getSettings(),
          })),
        });
        remoteVideoRef.current.onplay = () => {
          console.log("Video đang phát");
        };
        remoteVideoRef.current.onpause = () => {
          console.log("Video đã tạm dừng");
        };
      }
    };

    const interval = setInterval(checkVideoStream, 2000);
    return () => clearInterval(interval);
  }, []);

  if (remoteVideoRef.current) {
    console.log("remoteVideoRef.current", remoteVideoRef.current);
    remoteVideoRef.current.onloadeddata = () => {
      console.log("Video đã tải xong dữ liệu");
    };

    remoteVideoRef.current.onerror = (error) => {
      console.log("Lỗi video:", error);
    };

    remoteVideoRef.current.onstalled = () => {
      console.log("Video bị treo");
    };
  }
  if (status === "loading") return <div>Loading...</div>;
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Phần main content - bỏ padding để tránh scroll */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-full w-full bg-black">
            {/* Video chính - bỏ rounded ở full screen */}
            <audio ref={remoteAudioRef} autoPlay hidden />
            <div className="relative h-full w-full">
             
                <div hidden={enableRemoteVideo} className="w-full h-full flex items-center justify-center flex-col gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                  </Avatar>
                  <p className="text-base font-medium text-white">
                    {user.name}
                  </p>
                </div>
            
                <video hidden={!enableRemoteVideo}
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
            

              {/* Video nhỏ góc phải */}
              {callType === "video" && (
                <div className="absolute bottom-4 right-4 h-32 w-24 rounded-lg border-2 border-background overflow-hidden">
                 
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      className="h-full w-full object-cover"
                      hidden={!cameraEnabled}
                    />
                 
                    <div hidden={cameraEnabled} className="flex items-center justify-center h-full w-full bg-muted">
                      <Avatar className="h-18 w-18 border-2 border-gray-300">
                        <AvatarImage src={session?.user.avatar || ""} alt={session?.user.name || ""} />
                      </Avatar>
                    </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thanh điều khiển cố định ở dưới */}
      <div className="flex items-center justify-center gap-4 py-2 px-4 border-t bg-background/95 backdrop-blur-sm">
       
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={toggleMic}
          >
            {micEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={toggleCamera}
          >
            {cameraEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

        <Button
          variant="destructive"
          size="icon"
          className="rounded-full h-8 w-8"
          onClick={endCall}
        >
          <Phone className="h-6 w-6 rotate-135 transform" />
        </Button>
      </div>
    </div>
  );
}
