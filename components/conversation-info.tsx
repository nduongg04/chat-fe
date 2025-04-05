"use client"

import { useState } from "react"
import { BellOff, FileText, Search, Shield, User, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConversationUser {
  id: string
  name: string
  avatar: string 
  email?: string
  status: string
}

interface Media {
  id: string
  type: "image" | "file"
  url: string
  name: string
  date: string
}

interface ConversationInfoProps {
  user: ConversationUser
  isGroup?: boolean
  groupMembers?: ConversationUser[]
  media?: Media[]
  onClose: () => void
  onViewProfile: () => void
  onSearchInConversation: () => void
  onBlockUser: () => void
}

export function ConversationInfo({
  user,
  isGroup = false,
  groupMembers = [],
  media = [],
  onClose,
  onViewProfile,
  onSearchInConversation,
  onBlockUser,
}: ConversationInfoProps) {
  const [muteNotifications, setMuteNotifications] = useState(false)

  // Mock media data
  const mockMedia: Media[] = [
    {
      id: "media1",
      type: "image",
      url: "/placeholder.svg?height=100&width=100",
      name: "Image 1",
      date: "Today",
    },
    {
      id: "media2",
      type: "image",
      url: "/placeholder.svg?height=100&width=100",
      name: "Image 2",
      date: "Yesterday",
    },
    {
      id: "media3",
      type: "file",
      url: "#",
      name: "Document.pdf",
      date: "Yesterday",
    },
    {
      id: "media4",
      type: "file",
      url: "#",
      name: "Spreadsheet.xlsx",
      date: "Last week",
    },
  ]

  return (
    <div className="flex h-full w-80 flex-col border-l">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-medium">Conversation Info</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.status === "online" ? "Active now" : "Offline"}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellOff className="h-5 w-5 text-muted-foreground" />
                <span>Mute notifications</span>
              </div>
              <Switch checked={muteNotifications} onCheckedChange={setMuteNotifications} />
            </div>

            <Button variant="ghost" className="w-full justify-start" onClick={onSearchInConversation}>
              <Search className="mr-2 h-5 w-5 text-muted-foreground" />
              Search in conversation
            </Button>

            {!isGroup && (
              <Button variant="ghost" className="w-full justify-start" onClick={onViewProfile}>
                <User className="mr-2 h-5 w-5 text-muted-foreground" />
                View profile
              </Button>
            )}
          </div>

          <Separator className="my-4" />

          <Tabs defaultValue="media">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="media">Media</TabsTrigger>
              {isGroup ? (
                <TabsTrigger value="members">Members</TabsTrigger>
              ) : (
                <TabsTrigger value="files">Files</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="media" className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Photos & Videos</h4>
              <div className="grid grid-cols-3 gap-2">
                {mockMedia
                  .filter((item) => item.type === "image")
                  .map((image) => (
                    <div key={image.id} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Shared Files</h4>
              <div className="space-y-2">
                {mockMedia
                  .filter((item) => item.type === "file")
                  .map((file) => (
                    <div key={file.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                      <div className="rounded-md bg-muted p-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.date}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            {isGroup && (
              <TabsContent value="members" className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Group Members</h4>
                <div className="space-y-2">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.status === "online" ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>

          <Separator className="my-4" />

          <Button variant="destructive" className="w-full" onClick={onBlockUser}>
            <Shield className="mr-2 h-5 w-5" />
            Delete {isGroup ? "Group" : "User"}
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}

