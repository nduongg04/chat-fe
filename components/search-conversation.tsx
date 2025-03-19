"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface SearchResult {
  id: string
  content: string
  timestamp: string
  sender: string
}

interface SearchConversationProps {
  open: boolean
  onClose: () => void
  onNavigateToMessage: (messageId: string) => void
}

export function SearchConversation({ open, onClose, onNavigateToMessage }: SearchConversationProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock search results based on query
  const searchResults: SearchResult[] =
    searchQuery.length > 0
      ? [
          {
            id: "msg3",
            content: "That's awesome! We should celebrate sometime this week.",
            timestamp: "10:33 AM",
            sender: "Jane Smith",
          },
          {
            id: "msg5",
            content: "Friday works for me. Where should we meet?",
            timestamp: "10:36 AM",
            sender: "Jane Smith",
          },
          {
            id: "msg7",
            content: "Sounds perfect! Looking forward to it 😊",
            timestamp: "10:40 AM",
            sender: "Jane Smith",
          },
        ].filter((result) => result.content.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Search in Conversation</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{searchResults.length} results</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled={searchResults.length === 0}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={searchResults.length === 0}>
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="cursor-pointer rounded-md p-2 hover:bg-muted"
                  onClick={() => {
                    onNavigateToMessage(result.id)
                    onClose()
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.sender}</span>
                    <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                  </div>
                  <p className="text-sm">{result.content}</p>
                </div>
              ))}
            </div>
          ) : (
            searchQuery.length > 0 && <div className="py-4 text-center text-muted-foreground">No messages found</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

