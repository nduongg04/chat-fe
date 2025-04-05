"use client"

import { useState } from "react"
import { BellOff, FileText, Search, Shield, User, X, Lock, Key } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toastError, toastSuccess } from "@/lib/toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface ConversationUser {
  id: string
  name: string
  avatar: string
  email?: string
  status: string
  publicKey?: string
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
  onAddPublicKey: (key: string) => void
  currentUserPublicKey?: string | null
}

export function ConversationInfo({
  user,
  isGroup = false,
  groupMembers = [],
  onClose,
  onViewProfile,
  onSearchInConversation,
  onBlockUser,
  onAddPublicKey,
  currentUserPublicKey,
}: ConversationInfoProps) {
  const [muteNotifications, setMuteNotifications] = useState(false)
  const [publicKeyInput, setPublicKeyInput] = useState("")
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [showConfirmRemoveKey, setShowConfirmRemoveKey] = useState(false)

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

  const handleAddPublicKey = () => {
    if (publicKeyInput.trim() === "") {
      toastError("Please enter a valid public key")
      return
    }

    try {
      onAddPublicKey(publicKeyInput)
      setPublicKeyInput("")
      toastSuccess("Public key added successfully")
    } catch {
      toastError("Failed to add public key")
    }
  }

  const handleRemovePublicKey = () => {
    onAddPublicKey("")
    setShowConfirmRemoveKey(false)
    toastSuccess("Public key removed successfully")
  }

  return (
    <div className="flex h-full w-80 flex-col border-l">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-medium">Conversation Info</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* User Info */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {user.status === "online" ? "Active now" : "Offline"}
            </p>
            {user.publicKey && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                <Lock className="h-3 w-3" />
                <span>End-to-end encrypted</span>
              </div>
            )}
          </div>

          {/* Encryption Section */}
          <div className="mt-6 space-y-3 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-medium">
                <Key className="h-5 w-5" />
                Encryption
              </h4>
              {user.publicKey ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmRemoveKey(true)}
                >
                  Remove Key
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeyDialog(true)}
                >
                  Add Key
                </Button>
              )}
            </div>

            {user.publicKey ? (
              <div className="mt-2 space-y-2">
                <p className="text-sm">Messages are secured with end-to-end encryption.</p>
                <div className="rounded-md bg-background p-2">
                  <p className="text-xs font-medium">Public Key:</p>
                  <code className="text-xs break-all">{user.publicKey}</code>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add the user&#39;s public key to enable end-to-end encryption.
              </p>
            )}
          </div>

          {/* Conversation Actions */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellOff className="h-5 w-5 text-muted-foreground" />
                <span>Mute notifications</span>
              </div>
              <Switch checked={muteNotifications} onCheckedChange={setMuteNotifications} />
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={onSearchInConversation}
            >
              <Search className="mr-2 h-5 w-5 text-muted-foreground" />
              Search in conversation
            </Button>

            {!isGroup && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onViewProfile}
              >
                <User className="mr-2 h-5 w-5 text-muted-foreground" />
                View profile
              </Button>
            )}
          </div>

          <Separator className="my-4" />

          {/* Media/Files/Members Tabs */}
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
                        src={image.url}
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

          {/* Current User's Public Key */}
          {currentUserPublicKey && (
            <div className="mb-4 rounded-lg bg-muted p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Key className="h-4 w-4" />
                Your Public Key
              </h4>
              <code className="block break-all text-xs">{currentUserPublicKey}</code>
              <p className="mt-2 text-xs text-muted-foreground">
                Share this key with others to enable encrypted messaging.
              </p>
            </div>
          )}

          {/* Block User Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={onBlockUser}
          >
            <Shield className="mr-2 h-5 w-5" />
            Block {isGroup ? "Group" : "User"}
          </Button>
        </div>
      </ScrollArea>

      {/* Add Public Key Dialog */}
      <AlertDialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Public Key</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the public key of the user to enable end-to-end encrypted messaging.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Paste public key here"
              value={publicKeyInput}
              onChange={(e) => setPublicKeyInput(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddPublicKey}>
              Add Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Remove Key Dialog */}
      <AlertDialog open={showConfirmRemoveKey} onOpenChange={setShowConfirmRemoveKey}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Public Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Removing the public key will disable end-to-end encryption for this conversation.
              Existing encrypted messages may become unreadable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemovePublicKey}>
              Remove Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}