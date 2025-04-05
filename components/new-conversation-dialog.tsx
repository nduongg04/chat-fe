"use client"

import { useEffect, useState } from "react"
import { Check, Plus, Search, Users, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "next-auth"
import { fetchUsers } from "@/services/userService"
import { UserContact } from "@/types/user"
import { useSession } from "next-auth/react"
interface Contact {
  id: string
  name: string
  avatar: string
  email: string
  online: boolean
}

interface NewConversationDialogProps {
  open: boolean
  onClose: () => void
  onCreateConversation: (contactGroupIds: string[], contactId?: string, groupName?: string, isGroup?: boolean) => void
  accessToken?: string;
  userId?: string;
}
let isGroup = false
export function NewConversationDialog({ open, onClose, onCreateConversation, accessToken, userId }: NewConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<string>()
  const [selectedContactsGroup, setSelectedContactsGroup] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")
  
  const [filteredContacts, setFilteredContacts] = useState<UserContact[]>([])

  const [allListUser, setAllListUser] = useState<UserContact[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery) {
      setFilteredContacts(allListUser.filter((contact) => contact.username.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredContacts(allListUser);
    }
  }, [searchQuery]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers(accessToken || "");
        setAllListUser(response.data.users);
        setFilteredContacts(response.data.users);
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);
  const toggleContactSelection = (contactId: string) => {
    setSelectedContactsGroup((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleCreateConversation = () => {
    console.log(isGroup)
    if (selectedContact === undefined && isGroup === false) return
    onCreateConversation(selectedContactsGroup, selectedContact, groupName, isGroup)

    // Reset state
    setSelectedContact(undefined)
    setSelectedContactsGroup([])
    setGroupName("")
    setSearchQuery("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="chat" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" onClick={() => isGroup =false}>Chat</TabsTrigger>
            <TabsTrigger value="group" onClick={() => {
              console.log("group")
              isGroup = true
              console.log(isGroup)
            }}>Group</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-60">
              <div className="space-y-1">
                {allListUser.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                    onClick={() => {
                      // For chat tab, only allow selecting one contact
                      setSelectedContact(contact.id)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.username} />
                          <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.status === "online" && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{contact.username}</h3>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selectedContact === contact.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {selectedContact === contact.id && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end">
              <Button onClick={handleCreateConversation} disabled={selectedContact === undefined}>
                Start Chat
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="group" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Add participants..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {selectedContactsGroup.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedContactsGroup.map((contactId) => {
                  const contact = allListUser.find((c) => c.id === contactId)
                  if (!contact) return null

                  return (
                    <div key={contact.id} className="flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={contact.avatar} alt={contact.username} />
                        <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{contact.username}</span>
                      <button
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        onClick={() => toggleContactSelection(contact.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <ScrollArea className="h-48">
              <div className="space-y-1">
                {allListUser  
                  .filter((contact) => !selectedContactsGroup.includes(contact.id))
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                      onClick={() => toggleContactSelection(contact.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.username} />
                          <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{contact.username}</h3>
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end">
              <Button onClick={handleCreateConversation} disabled={selectedContactsGroup.length < 3 || !groupName}>
                <Users className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

