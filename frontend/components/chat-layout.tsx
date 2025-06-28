"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/components/chat-header";
import ChatWindow from "@/components/chat-window";
import ContactList from "@/components/contact-list";
import ProfileModal from "@/components/profile-modal";
import { API_URL, WS_URL } from "@/lib/config";
import type { Contact, Message, User } from "@/types";
import ChatWelcome from "./chat-welcome";

interface ChatLayoutProps {
	user: User;
	onLogout: () => void;
}

export default function ChatLayout({ user, onLogout }: ChatLayoutProps) {
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const selectedContactRef = useRef<Contact | null>(null);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		selectedContactRef.current = selectedContact;
	}, [selectedContact]);

	useEffect(() => {
		console.log("useEffect");
		console.log(user);
		connectWebSocket();
		fetchContacts();

		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, []);

	// TODO: fix why websocket gets disconnected, make sure only one websocket request is made and it stays stable
	const connectWebSocket = () => {
		const ws = new WebSocket(`${WS_URL}/ws?token=${user.token}`);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("WebSocket connected");
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			try {
				const eventData = JSON.parse(event.data);

				if (eventData.type === "message") {
					const newMessage: Message = eventData.data;

					const contactUsername =
						newMessage.sender === user.username
							? newMessage.recipient
							: newMessage.sender;
					const isForCurrentContact =
						selectedContactRef.current?.username === contactUsername;

					// Add message to the active chat window
					if (isForCurrentContact) {
						setMessages((prevMessages) => {
							if (prevMessages.some((msg) => msg.id === newMessage.id)) {
								return prevMessages;
							}
							return [...prevMessages, newMessage];
						});
					}
					// Update contact in the contact list
					setContacts((prevContacts) => {
						const contactIndex = prevContacts.findIndex(
							(c) => c.username === contactUsername,
						);

						if (contactIndex === -1) {
							// This should be a new conversation, which should be handled by
							// a `conversation_update` event from the backend to add the new contact.
							// Or we could fetch all contacts again. For now, we do nothing.
							return prevContacts;
						}

						const existingContact = prevContacts[contactIndex];
						const isOwnMessage = newMessage.sender === user.username;

						const updatedContact: Contact = {
							...existingContact,
							last_message: newMessage.text,
							last_message_timestamp: newMessage.timestamp,
							// Only increment unread count for incoming messages
							unread_count: !isOwnMessage
								? (existingContact.unread_count || 0) + 1
								: existingContact.unread_count,
						};

						// Update the selected contact state as well if it's the active chat
						if (isForCurrentContact) {
							setSelectedContact(updatedContact);
						}

						const newContacts = prevContacts.map((c) =>
							c.username === contactUsername ? updatedContact : c,
						);

						// Sort to bring the contact with the newest message to the top
						newContacts.sort(
							(a, b) =>
								new Date(b.last_message_timestamp || 0).getTime() -
								new Date(a.last_message_timestamp || 0).getTime(),
						);

						return newContacts;
					});
				} else if (eventData.type === "conversation_update") {
					const updatedConversation: Contact = eventData.data;
					setContacts((prevContacts) => {
						const index = prevContacts.findIndex(
							(c) => c.username === updatedConversation.username,
						);
						if (index !== -1) {
							const newContacts = [...prevContacts];
							newContacts[index] = updatedConversation;
							// Sort to bring the updated contact to the top
							newContacts.sort(
								(a, b) =>
									new Date(b.last_message_timestamp || 0).getTime() -
									new Date(a.last_message_timestamp || 0).getTime(),
							);
							return newContacts;
						} else {
							// Add as a new contact and sort
							const newContacts = [updatedConversation, ...prevContacts];
							newContacts.sort(
								(a, b) =>
									new Date(b.last_message_timestamp || 0).getTime() -
									new Date(a.last_message_timestamp || 0).getTime(),
							);
							return newContacts;
						}
					});
				}
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error);
			}
		};

		ws.onclose = (event) => {
			console.log("WebSocket disconnected:", event.code, event.reason);
			setIsConnected(false);
			setTimeout(connectWebSocket, 3000);
		};

		ws.onerror = (event) => {
			console.error("WebSocket error:", event);
			ws.close();
		};
	};

	const fetchContacts = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/conversations`, {
				headers: { Authorization: `Bearer ${user.token}` },
			});
			if (response.ok) {
				const data: Contact[] = await response.json();
				setContacts(data);
			}
		} catch (error) {
			console.error("Failed to fetch contacts:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const markMessagesAsRead = async (messageId: number | string) => {
		try {
			const response = await fetch(`${API_URL}/messages/read`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
				body: JSON.stringify({ message_id: messageId }),
			});

			if (response.ok) {
				const updatedConversation: Contact = await response.json();
				setContacts((prevContacts) =>
					prevContacts.map((c) =>
						c.username === updatedConversation.username
							? updatedConversation
							: c,
					),
				);
				// Update selected contact details, contacts array re-renders contact list not opened chat window
				setSelectedContact(updatedConversation);
			}

			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg.id === messageId ? { ...msg, is_read: true } : msg,
				),
			);
		} catch (error) {
			console.error("Failed to mark message as read:", error);
		}
	};

	const fetchMessages = async (contactUsername: string) => {
		try {
			const response = await fetch(
				`${API_URL}/conversations/${contactUsername}/messages`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
			if (response.ok) {
				const data: Message[] = await response.json();
				setMessages(data);
			}
		} catch (error) {
			console.error("Failed to fetch messages:", error);
		}
	};

	const sendMessage = async (text: string) => {
		if (!selectedContact) return;

		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			const message = {
				text,
				recipient: selectedContact.username,
			};
			wsRef.current.send(JSON.stringify(message));
		} else {
			// TODO: fix in future
			alert("Websocket not connected");
		}
	};

	const handleContactSelect = (contact: Contact) => {
		setSelectedContact(contact);
		fetchMessages(contact.username);
	};

	const handleNewChat = (newContactUser: {
		username: string;
		name: string;
	}) => {
		const existingContact = contacts.find(
			(c) => c.username === newContactUser.username,
		);
		if (existingContact) {
			setSelectedContact(existingContact);
			fetchMessages(existingContact.username);
		} else {
			const newContact: Contact = {
				username: newContactUser.username,
				name: newContactUser.name,
				lastMessage: "Start a new conversation!",
				timestamp: new Date().toISOString(),
			};
			setContacts((prev) => [newContact, ...prev]);
			setSelectedContact(newContact);
			setMessages([]);
		}
	};

	return (
		<div className="h-screen flex bg-gray-50 dark:bg-gray-900">
			<ChatHeader
				user={user}
				isConnected={isConnected}
				onLogout={onLogout}
				onProfileOpen={() => setIsProfileOpen(true)}
			/>

			{/* Main Content */}
			<div className="flex flex-1 pt-16">
				{/* Contact List */}
				<div className="w-80 border-r border-gray-200 dark:border-gray-700">
					<ContactList
						contacts={contacts}
						selectedContact={selectedContact}
						onContactSelect={handleContactSelect}
						onNewChat={handleNewChat}
						user={user}
						isLoading={isLoading}
					/>
				</div>

				{/* Chat Window or Welcome */}
				{/* TODO: On 'Esc' close chat window, on 'Enter' send message */}
				<div className="flex-1">
					{selectedContact ? (
						<ChatWindow
							contact={selectedContact}
							messages={messages}
							onSendMessage={sendMessage}
							user={user}
							onMarkAsRead={markMessagesAsRead}
						/>
					) : (
						<ChatWelcome />
					)}
				</div>
			</div>

			{/* Profile Modal */}
			<ProfileModal
				isOpen={isProfileOpen}
				onClose={() => setIsProfileOpen(false)}
				user={user}
			/>
		</div>
	);
}
