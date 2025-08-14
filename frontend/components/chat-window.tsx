"use client";
import { ArrowDown, MoreVertical } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import ChatMessage from "@/components/chat-message";
import MessageInput from "@/components/message-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import type { Contact, Message, User } from "@/types";
import Separator from "./separator";

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

		setTimeout(() => {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}, 500);
	};

	const endRef = useRef<HTMLDivElement>(null);
	const unreadDividerRef = useRef<HTMLDivElement>(null);
	const dividerMessageIdRef = useRef<number | string>(null);

	const endIntersectionObserver = useIntersectionObserver({
		threshold: 0.5,
	});

	const firstUnreadId = useMemo(() => {
		if (!messages.length) return null;
		return messages.find(
			(message) => !message.is_read && message.sender === contact.username,
		)?.id;
	}, [messages]);

	// TODO: This is taking to divider ref instead of first unread message. so if first unread change it will always put to divider
	// Idea is to check if divider is being intersected and if so, go to endRef
	const handleScrollDown = () => {
		if (dividerMessageIdRef.current) {
			unreadDividerRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		} else {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	};

	if (!dividerMessageIdRef.current)
		// INFO: make sure divider stays at the same place
		dividerMessageIdRef.current = firstUnreadId || null;

	// INFO: On render, scroll to the first unread message OR to the bottom
	useEffect(() => {
		if (dividerMessageIdRef.current) {
			unreadDividerRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		} else {
			endRef.current?.scrollIntoView({
				behavior: "auto",
				block: "end",
			});
		}
	}, [dividerMessageIdRef.current]); // only run when dividerMessageIdRef changes, not scroll back to divider when message gets read

	// INFO: scroll to end when messages change
	useEffect(() => {
		// if not at the end, don't scroll
		if (!endIntersectionObserver.isIntersecting) return;

		// don't scroll if there is 2 or more unread messages
		if (
			messages.filter(
				(message) => !message.is_read && message.sender === contact.username,
			).length > 1
		)
			return;
		endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages.length]);

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
										<div
											key={message.id}
											ref={
												dividerMessageIdRef.current === message.id
													? unreadDividerRef
													: undefined
											}
										>
											{/* INFO: divider for unread messages */}
											{dividerMessageIdRef.current === message.id && (
												<Separator message={"Unread Messages"} />
											)}
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
						<div ref={endIntersectionObserver.ref} />
						<div ref={endRef} />
					</div>
				</ScrollArea>
				{/* INFO: Scroll to bottom button */}
				{!endIntersectionObserver.isIntersecting && (
					<Button
						onClick={handleScrollDown}
						variant="ghost"
						size="icon"
						className="animate-bounce absolute bottom-6 right-6 rounded-full h-12 w-12 bg-pink-500/80 hover:bg-pink-600/90 text-white shadow-lg backdrop-blur-sm"
					>
						<ArrowDown className="h-6 w-6" />
						{/* TODO: make a component for unread badge (bcz it is repeated in contact-item.tsx) (just not absolute positioning)*/}
						{contact.unread_count > 0 && (
							<Badge className="absolute -top-2 left-1/2 -translate-x-1/2  bg-purple-600 text-white">
								{contact.unread_count > 999 ? "999+" : contact.unread_count}
							</Badge>
						)}
					</Button>
				)}
			</div>

			<MessageInput
				newMessage={newMessage}
				setNewMessage={setNewMessage}
				handleSendMessage={handleSendMessage}
			/>
		</div>
	);
}
