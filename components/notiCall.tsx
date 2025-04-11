"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io("http://localhost:8080")

/*eslint-disable*/
export function NotiCall() {
     const { data: session } = useSession();
     const accessToken = session?.user.accessToken;
     const userId = session?.user.id;
    const [isCall, setIsCall] = useState(false)
    const [data, setData] = useState<{
        senderId: string;
        recipientId: string;
        callType: string;
        avatar: string;
        name: string;
    } | null>(null)
    const rejectCall = () => {
        socket.emit("reject-call", {
            senderId: userId,
            recipientId: data?.senderId
        })
        setIsCall(false);
        return ;
    }
    const acceptCall = () => {
        socket.emit("accept-call", {
            senderId: userId,
            recipientId: data?.senderId
        })
        if(data) {
            const url = `/call/${data.senderId}?type=${data.callType}`;
            window.open(url, "_blank", "width=800,height=600");
        }
        setIsCall(false);
    }
     useEffect(() => {
          socket.on("request-call", (data: any) => {
               if (data.recipientId == userId) {
                 setIsCall(true);
                 setData(data);
               }
          })    
     }, [userId])
     if(!isCall) return null;
     return (
       <div x className="absolute top-0 right-0 w-full h-full bg-black/50 flex justify-center items-center">
         <div className="bg-white p-2 rounded-lg w-[280px] flex flex-col items-center">
           <div className="flex justify-center border-b-1 border-gray-200 px-2">
             <p className="text-lg font-bold">{data?.callType}</p>
           </div>
           <img
             src={data?.avatar}
             alt="avatar"
             className="w-16 h-16 rounded-full mx-auto mt-2 border-2 border-gray-200"
           />
           <p className="text-base font-medium mt-2 text-gray-600">{data?.name}</p>
           <div className="flex gap-4 justify-center mt-3 mb-2 items-center w-full px-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md active:bg-blue-600 active:scale-95 transition-all duration-300" onClick={acceptCall}>Accept</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md active:bg-red-600 active:scale-95 transition-all duration-300" onClick={rejectCall}>Reject</button>
           </div>
         </div>
       </div>
     );
}

