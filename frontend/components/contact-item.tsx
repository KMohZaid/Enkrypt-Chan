import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";
import type { Contact } from "@/types";

interface ContactItemProps {
	contact: Contact;
	isSelected: boolean;
	onSelect: () => void;
}

export default function ContactItem({
	contact,
	isSelected,
	onSelect,
}: ContactItemProps) {
	return (
		<div
			className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${isSelected ? "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 dark:border-pink-400" : ""}`}
			onClick={onSelect}
		>
			<div className="relative">
				<Avatar className="h-12 w-12">
					<AvatarImage src={`https://i.pravatar.cc/40?u=${contact.username}`} />
					<AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
						{contact.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				{contact.isOnline && (
					<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<p className="font-medium text-gray-900 dark:text-gray-100 truncate">
						{contact.name}
					</p>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						{formatTime(contact.last_message_timestamp)}
					</span>
				</div>
				<div className="flex items-center justify-between">
					<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
						{contact.last_message}
					</p>
					{contact.unread_count > 0 && (
						<Badge className="bg-purple-600 text-white">
							{contact.unread_count > 999 ? "999+" : contact.unread_count}
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
}
