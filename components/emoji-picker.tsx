"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

// Mock emoji categories and emojis
const emojiCategories = [
  {
    id: "smileys",
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  },
  {
    id: "gestures",
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋"],
  },
  {
    id: "animals",
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"],
  },
  {
    id: "food",
    name: "Food",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆"],
  },
  {
    id: "travel",
    name: "Travel",
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️"],
  },
]

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter emojis based on search query
  const filteredEmojis =
    searchQuery.length > 0
      ? emojiCategories.flatMap((category) => category.emojis.filter((emoji) => emoji.includes(searchQuery)))
      : []

  return (
    <div className="absolute bottom-16 right-0 z-10 w-72 rounded-lg border bg-background p-2 shadow-lg">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-sm font-medium">Emoji</h3>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative my-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search emoji..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery.length > 0 ? (
        <div className="h-48 p-2">
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">Search Results</h4>
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis.length > 0 ? (
              filteredEmojis.map((emoji, index) => (
                <button
                  key={index}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-muted"
                  onClick={() => onEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))
            ) : (
              <div className="col-span-8 flex h-full items-center justify-center text-muted-foreground">
                No emojis found
              </div>
            )}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="smileys" className="h-48">
          <TabsList className="grid w-full grid-cols-5">
            {emojiCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="px-1 py-1.5">
                {category.emojis[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {emojiCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-2">
              <ScrollArea className="h-32">
                <div className="grid grid-cols-8 gap-1">
                  {category.emojis.map((emoji, index) => (
                    <button
                      key={index}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-lg hover:bg-muted"
                      onClick={() => onEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

