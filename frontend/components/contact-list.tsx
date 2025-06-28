"use client";

import { Loader2, Users } from "lucide-react";
import ContactItem from "@/components/contact-item";
import SearchUsers from "@/components/search-users";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Contact, User } from "@/types";

interface ContactListProps {
	contacts: Contact[];
	selectedContact: Contact | null;
	onContactSelect: (contact: Contact) => void;
	onNewChat: (user: { username: string; name: string }) => void;
	user: User;
	isLoading: boolean;
}

interface SearchUser {
	username: string;
	name: string;
}

export default function ContactList({
	contacts,
	selectedContact,
	onContactSelect,
	onNewChat,
	user,
	isLoading,
}: ContactListProps) {
	return (
		<div className="h-full flex flex-col bg-white dark:bg-gray-800">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
						Chats
					</h2>
					<SearchUsers user={user} onNewChat={onNewChat} />
				</div>
			</div>

			<ScrollArea className="flex-1">
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-pink-500" />
					</div>
				) : contacts.length === 0 ? (
					<div className="text-center py-8 px-4">
						<Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
						<p className="text-gray-500 dark:text-gray-400 mb-2">
							No conversations yet
						</p>
						<p className="text-sm text-gray-400 dark:text-gray-500">
							Click the + button to start chatting!
						</p>
					</div>
				) : (
					<div className="p-2">
						{contacts.map((contact) => (
							<ContactItem
								key={contact.username}
								contact={contact}
								isSelected={selectedContact?.username === contact.username}
								onSelect={() => onContactSelect(contact)}
							/>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
