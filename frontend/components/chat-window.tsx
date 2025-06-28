"use client";
import { MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";
import ChatMessage from "@/components/chat-message";
import MessageInput from "@/components/message-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate } from "@/lib/utils";
import type { Contact, Message, User } from "@/types";

interface ChatWindowProps {
	contact: Contact;
	messages: Message[];
	onSendMessage: (content: string) => void;
	user: User;
	onMarkAsRead: (messageId: number | string) => void;
}

export default function ChatWindow({
	contact,
	messages,
	onSendMessage,
	user,
	onMarkAsRead,
}: ChatWindowProps) {
	const [newMessage, setNewMessage] = useState("");

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;
		onSendMessage(newMessage.trim());
		setNewMessage("");
	};

	// INFO: Memoize grouped messages to prevent recalculation on every render
	const groupedMessages = useMemo(
		() =>
			messages.reduce((groups: { [key: string]: Message[] }, message) => {
				const dateKey = formatDate(message.timestamp) || "Invalid Date";
				if (!groups[dateKey]) {
					groups[dateKey] = [];
				}
				groups[dateKey].push(message);
				return groups;
			}, {}),
		[messages],
	);

	return (
		<div className="h-full flex flex-col bg-white dark:bg-gray-800">
			<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-3">
					<div className="relative">
						{/* TODO: Add a actual avatar for user and use that from api */}
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={`https://i.pravatar.cc/40?u=${contact.username}`}
							/>
							<AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
								{contact.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						{contact.isOnline && (
							<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
						)}
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100">
							{contact.name}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{contact.isOnline ? "Online" : "Offline"}
						</p>
					</div>
				</div>

				<Button variant="ghost" size="sm">
					<MoreVertical className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex-1 relative min-h-0">
				<ScrollArea className="h-full p-4">
					<div className="space-y-4">
						{Object.entries(groupedMessages).map(([date, dateMessages]) => (
							<div key={date}>
								<div className="flex items-center justify-center my-4">
									<div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
										<span className="text-xs text-gray-600 dark:text-gray-400">
											{date}
										</span>
									</div>
								</div>
								{dateMessages.map((message, index) => {
									const isSelfUser = message.sender === user.username;
									const showAvatar =
										!isSelfUser &&
										(index === 0 ||
											dateMessages[index - 1]?.sender !== message.sender);
									const isUnread =
										!message.is_read &&
										message.recipient === user.username &&
										message.sender === contact.username;

									return (
										<div key={message.id} className="mb-2">
											<ChatMessage
												contact={contact}
												message={message}
												isUnread={isUnread}
												isSelfUser={isSelfUser}
												showAvatar={showAvatar}
												onReadAction={onMarkAsRead}
											/>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			<MessageInput
				newMessage={newMessage}
				setNewMessage={setNewMessage}
				handleSendMessage={handleSendMessage}
			/>
		</div>
	);
}
