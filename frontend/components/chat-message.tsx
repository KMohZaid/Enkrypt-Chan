"use client";

import { CheckCheck } from "lucide-react";
import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/lib/utils";
import type { Contact, Message } from "@/types";

type ChatMessageProps = {
	contact: Contact;
	message: Message;
	isUnread: boolean;
	isSelfUser: boolean;
	showAvatar: boolean;
	onReadAction: (id: Message["id"]) => void;
};

export default function ChatMessage({
	showAvatar,
	message,
	isUnread,
	isSelfUser,
	onReadAction,
	contact,
}: ChatMessageProps) {
	const interactObserver = useIntersectionObserver({
		threshold: 0.5,
	});

	useEffect(() => {
		if (isUnread && interactObserver?.isIntersecting) {
			onReadAction(message.id);
			console.log(
				`Message ${message.id} is intersecting (not reading for now)`,
			);
		}
	}, [isUnread, interactObserver]);

	return (
		<div className="my-2" ref={isUnread ? interactObserver?.ref : null}>
			<div
				className={`flex items-end gap-3 ${isSelfUser ? "justify-end" : "justify-start"}`}
			>
				{!isSelfUser && (
					<div>
						{/* TODO: Add a actual avatar for user and use that from api */}
						{showAvatar ? (
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={`https://i.pravatar.cc/32?u=${contact.username}`}
								/>
								<AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
									{contact.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						) : (
							<div className="w-8 h-8" />
						)}
					</div>
				)}
				<div className={`max-w-xs lg:max-w-md ${isSelfUser ? "order-1" : ""}`}>
					<div
						className={`px-4 py-2 rounded-2xl ${isSelfUser ? "bg-white border border-pink-500 text-gray-900 dark:bg-gray-800 dark:text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}
					>
						<div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>
						<div
							className={`flex items-center gap-1 mt-1 ${isSelfUser ? "justify-end" : "justify-start"}`}
						>
							<span
								className={`text-xs ${isSelfUser ? "text-pink-500 dark:text-pink-200" : "text-gray-500 dark:text-gray-400"}`}
							>
								{formatTime(message.timestamp)}
							</span>
							{/* TODO: Remove mark as read button, make it auto works when intersecting */}
							{isUnread && (
								<button
									className="text-xs text-blue-500 hover:text-blue-700"
									onClick={() => onReadAction(message.id)}
								>
									Mark as read
								</button>
							)}
							{/* TODO: implement single grey tick for sent to server and 2 grey tick when delivered */}
							{/* TODO: Add a tooltip for the tick */}
							{/* TODO: make sure tick is visible */}

							{isSelfUser && (
								<>
									{/* TODO: implement single grey tick for sent to server and 2 grey tick when delivered */}
									{message.is_read && (
										<CheckCheck className="h-4 w-4 text-blue-400" />
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
