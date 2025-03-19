"use client"
import { Calendar, Mail, UserPlus, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  birthday?: string
  status: string
}

interface ProfileModalProps {
  user: User
  open: boolean
  onClose: () => void
}

export function ProfileModal({ user, open, onClose }: ProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Profile Information</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.status === "online" ? "Online" : "Offline"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email || "Not provided"}</p>
            </div>
          </div>

          {user.birthday && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Birthday</p>
                <p className="text-sm text-muted-foreground">{user.birthday}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

