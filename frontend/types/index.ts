export interface User {
	username: string;
	name: string;
	token: string;
}

export interface Contact {
	username: string;
	name: string;
	last_message: string | null;
	last_message_timestamp: string | null;
	unread_count: number;
	isOnline?: boolean;
}

export interface Message {
	id: number | string;
	text: string;
	sender: string;
	recipient: string;
	timestamp: string;
	is_read: boolean;
}
