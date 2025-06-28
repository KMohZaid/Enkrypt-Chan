import { Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
	newMessage: string;
	setNewMessage: (value: string) => void;
	handleSendMessage: (e: React.FormEvent) => void;
}

export default function MessageInput({
	newMessage,
	setNewMessage,
	handleSendMessage,
}: MessageInputProps) {
	return (
		<div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
			<form onSubmit={handleSendMessage} className="flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="text-gray-500 hover:text-pink-500"
				>
					<Paperclip className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="text-gray-500 hover:text-pink-500"
				>
					<Smile className="h-4 w-4" />
				</Button>
				<Input
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					className="flex-1"
				/>
				<Button
					type="submit"
					disabled={!newMessage.trim()}
					className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
				>
					<Send className="h-4 w-4" />
				</Button>
			</form>
		</div>
	);
}
