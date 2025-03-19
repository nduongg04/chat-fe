"use client"

import { useState } from "react"
import { Check, MessageCircle, Search, User, UserPlus, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileModal } from "@/components/profile-modal"

// Mock data for contacts
const mockContacts = [
  {
    id: "1",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "jane.smith@example.com",
    online: true,
    isFriend: true,
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "john.doe@example.com",
    online: true,
    isFriend: true,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah.johnson@example.com",
    online: false,
    isFriend: true,
  },
  {
    id: "4",
    name: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mike.wilson@example.com",
    online: false,
    isFriend: true,
  },
  {
    id: "5",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "emily.davis@example.com",
    online: true,
    isFriend: true,
  },
  {
    id: "6",
    name: "David Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "david.brown@example.com",
    online: false,
    isFriend: true,
  },
  {
    id: "7",
    name: "Lisa Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "lisa.taylor@example.com",
    online: true,
    isFriend: true,
  },
  {
    id: "8",
    name: "Robert Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "robert.miller@example.com",
    online: false,
    isFriend: true,
  },
  // Non-friend users that can be found via search
  {
    id: "9",
    name: "Thomas Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "thomas.anderson@example.com",
    online: true,
    isFriend: false,
  },
  {
    id: "10",
    name: "Jessica Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "jessica.williams@example.com",
    online: false,
    isFriend: false,
  },
  {
    id: "11",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "michael.brown@example.com",
    online: true,
    isFriend: false,
  },
]

// Mock data for friend requests
const mockFriendRequests = [
  {
    id: "req1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "alex.johnson@example.com",
    mutualFriends: 3,
  },
  {
    id: "req2",
    name: "Olivia Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "olivia.williams@example.com",
    mutualFriends: 1,
  },
]

export function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  // Filter contacts based on search query
  // If search query is empty, only show friends
  // If search query exists, search through all users by name or email
  const filteredContacts =
    searchQuery.length > 0
      ? mockContacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : mockContacts.filter((contact) => contact.isFriend)

  const handleViewProfile = (user) => {
    setSelectedUser(user)
    setShowProfileModal(true)
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <p className="text-sm text-muted-foreground">Manage your contacts and friend requests</p>
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <div className="border-b px-4 py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="requests">Friend Requests</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 p-0">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-1 p-2">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewProfile(contact)}>
                        <User className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      {!contact.isFriend && (
                        <Button variant="outline" size="sm">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <p className="text-muted-foreground">No contacts found</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Contact
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="flex-1 p-0">
          <div className="p-4">
            <h2 className="text-lg font-medium">Friend Requests</h2>
            <p className="text-sm text-muted-foreground">
              {mockFriendRequests.length} pending request{mockFriendRequests.length !== 1 && "s"}
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-4 p-4">
              {mockFriendRequests.map((request) => (
                <div key={request.id} className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.avatar} alt={request.name} />
                        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{request.name}</h3>
                        <p className="text-xs text-muted-foreground">{request.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.mutualFriends} mutual friend{request.mutualFriends !== 1 && "s"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Profile Modal */}
      {selectedUser && (
        <ProfileModal
          user={{
            ...selectedUser,
            birthday: "January 15, 1990", // Mock birthday data
          }}
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  )
}

