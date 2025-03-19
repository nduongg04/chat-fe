"use client"

import { useState } from "react"
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface User {
  id: string
  name: string
  avatar: string
}

interface CallScreenProps {
  user: User
  callType: "audio" | "video"
  open: boolean
  onClose: () => void
}

export function CallScreen({ user, callType, open, onClose }: CallScreenProps) {
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(callType === "video")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="relative flex h-80 flex-col items-center justify-center rounded-lg bg-muted">
          {cameraEnabled ? (
            <div className="h-full w-full rounded-lg bg-black">
              {/* This would be a video stream in a real app */}
              <div className="flex h-full items-center justify-center">
                <p className="text-white">Camera Preview</p>
              </div>

              {/* Remote user video would be here */}
              <div className="absolute bottom-4 right-4 h-32 w-24 rounded-lg border-2 border-background bg-muted">
                <div className="flex h-full items-center justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{callType === "audio" ? "Audio call" : "Video call"}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => setMicEnabled(!micEnabled)}>
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCameraEnabled(!cameraEnabled)}
          >
            {cameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button variant="destructive" size="icon" className="rounded-full" onClick={onClose}>
            <Phone className="h-5 w-5 rotate-135 transform" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

