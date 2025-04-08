"use client";

import { logout } from "@/actions/logout";
import { NewConversationDialog } from "@/components/new-conversation-dialog";
import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	createGroupConversation,
	createPrivateConversation,
	fetchChatRooms,
} from "@/services/chatService";
import { ChatRoom } from "@/types/chat";
import { Edit, LogOut, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ChatList from "./chat-list";

interface ChatSidebarProps {
	activeConversationId?: string;
	activeTab?: string;
	accessToken?: string;
	userId?: string;
}

export function ChatSidebar({
	activeConversationId,
	activeTab = "chats",
	accessToken,
	userId,
}: ChatSidebarProps) {
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filteredConversations, setFilteredConversations] =
		useState(chatRooms);
	useEffect(() => {
		const loadChatRooms = async () => {
			try {
				setLoading(true);
				const response = await fetchChatRooms(
					accessToken || "",
					userId || ""
				);
				setChatRooms(response.data);
				setFilteredConversations(response.data);
			} catch (err) {
				toast.error("Failed to load chat rooms");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		try {
			loadChatRooms();
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		}
	}, []);

	const { theme, setTheme } = useTheme();
	const [searchQuery, setSearchQuery] = useState("");
	const [showNewConversationDialog, setShowNewConversationDialog] =
		useState(false);

	const router = useRouter();

	// Add event listener for the new conversation button in the welcome screen
	useEffect(() => {
		const handleNewConversation = () => {
			setShowNewConversationDialog(true);
		};

		window.addEventListener("new-conversation", handleNewConversation);

		return () => {
			window.removeEventListener(
				"new-conversation",
				handleNewConversation
			);
		};
	}, []);

	useEffect(() => {
		if (searchQuery.trim() == "" || searchQuery == null) {
			setFilteredConversations(chatRooms);
			return;
		}
		setFilteredConversations(
			chatRooms.filter((chat) =>
				chat.members.some((member) =>
					member.username
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
			)
		);
	}, [searchQuery]);

	return (
		<div className="flex h-full w-80 flex-col border-r">
			<div className="flex items-center justify-between border-b p-4">
				<h1 className="text-xl font-bold text-primary">Messenger</h1>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() =>
							setTheme(theme === "dark" ? "light" : "dark")
						}
						className="rounded-full"
					>
						{theme === "dark" ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage
										src="/placeholder.svg?height=32&width=32"
										alt="User"
									/>
									<AvatarFallback>ME</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<div className="flex items-center justify-start gap-2 p-2">
								<div className="flex flex-col space-y-1 leading-none">
									<p className="font-medium">Alex Johnson</p>
									<p className="text-sm text-muted-foreground">
										alex@example.com
									</p>
								</div>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link
									href="/settings"
									className="flex w-full cursor-pointer items-center"
								>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-red-600 focus:text-red-600"
								onClick={async () => {
									await logout();
								}}
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="p-4">
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search conversations..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex-1 overflow-auto">
				<ChatList
					chatRooms={filteredConversations}
					activeConversationId={activeConversationId}
					userId={userId || ""}
				/>
			</div>

			<div className="border-t p-4">
				<Button
					className="w-full"
					size="sm"
					onClick={() => setShowNewConversationDialog(true)}
				>
					<Edit className="mr-2 h-4 w-4" />
					New Conversation
				</Button>
			</div>
			<NewConversationDialog
				accessToken={accessToken}
				userId={userId}
				open={showNewConversationDialog}
				onClose={() => setShowNewConversationDialog(false)}
				onCreateConversation={(
					contactIds,
					contactId,
					groupName,
					isGroup
				) => {
					if (!isGroup) {
						if (contactId) {
							const createChat = async () => {
								try {
									const response =
										await createPrivateConversation(
											accessToken || "",
											contactId,
											userId || ""
										);
									setChatRooms([response.data, ...chatRooms]);
									setFilteredConversations([
										response.data,
										...filteredConversations,
									]);
									router.push(`/chat/${response.data._id}`);
								} catch (err) {
									console.error("err", err);
									toast.error(
										"Failed to create conversation"
									);
								}
							};
							createChat();
						}
					} else {
						if (contactIds && groupName) {
							const createGroup = async () => {
								try {
									const response =
										await createGroupConversation(
											accessToken || "",
											groupName,
											userId || "",
											contactIds
										);
									setChatRooms([response.data, ...chatRooms]);
									setFilteredConversations([
										response.data,
										...filteredConversations,
									]);
									router.push(`/chat/${response.data._id}`);
								} catch (e) {
									console.error("err", e);
									toast.error("Failed to create group");
								}
							};
							createGroup();
						}
					}
					setShowNewConversationDialog(false);
				}}
			/>
		</div>
	);
}
