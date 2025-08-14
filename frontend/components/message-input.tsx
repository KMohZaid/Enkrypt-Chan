"use client";

import EmojiPicker, {
	EmojiStyle,
	Theme as EmojiTheme,
} from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

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
	const { theme } = useTheme();

	const onEmojiClick = (emojiObject: { emoji: string }) => {
		setNewMessage(newMessage + emojiObject.emoji);
	};

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
				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="text-gray-500 hover:text-pink-500"
						>
							<Smile className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full">
						<EmojiPicker
							theme={theme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT}
							onEmojiClick={onEmojiClick}
							searchPlaceHolder="Find uwu-moji (ꈍ ω ꈍ)"
							emojiStyle={EmojiStyle.APPLE} //  TODO: allow user to choose
							customEmojis={[]} // TODO: add custom emojis (https://github.com/ealush/emoji-picker-react)
							// TODO: Use followng props on message to add reactions support
							// https://github.com/ealush/emoji-picker-react
							reactions={undefined}
							onReactionClick={undefined}
						/>
					</PopoverContent>
				</Popover>
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
