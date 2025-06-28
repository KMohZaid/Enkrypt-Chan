import { Loader2, Search, Users } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_URL } from "@/lib/config";
import type { User } from "@/types";

interface SearchUsersProps {
	user: User;
	onNewChat: (user: { username: string; name: string }) => void;
}

interface SearchUser {
	username: string;
	name: string;
}

export default function SearchUsers({ user, onNewChat }: SearchUsersProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(
				`${API_URL}/users/search?username=${encodeURIComponent(query)}`,
				{
					headers: { Authorization: `Bearer ${user.token}` },
				},
			);
			if (response.ok) {
				const users: SearchUser[] = await response.json();
				setSearchResults(users.filter((u) => u.username !== user.username));
			} else {
				setSearchResults([]);
			}
		} catch (error) {
			console.error("Search failed:", error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleStartChat = (searchUser: SearchUser) => {
		onNewChat(searchUser);
		setIsSearchOpen(false);
		setSearchQuery("");
		setSearchResults([]);
	};

	return (
		<Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
				>
					<Users className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Users className="h-5 w-5 text-pink-500" />
						Start New Chat
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search users..."
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-10"
						/>
					</div>
					<ScrollArea className="h-64">
						{isSearching ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-pink-500" />
							</div>
						) : searchResults.length > 0 ? (
							<div className="space-y-2">
								{searchResults.map((searchUser) => (
									<div
										key={searchUser.username}
										className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
										onClick={() => handleStartChat(searchUser)}
									>
										<Avatar className="h-10 w-10">
											<AvatarImage
												src={`https://i.pravatar.cc/40?u=${searchUser.username}`}
											/>
											<AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
												{searchUser.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-gray-900 dark:text-gray-100 truncate">
												{searchUser.name}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
												@{searchUser.username}
											</p>
										</div>
									</div>
								))}
							</div>
						) : searchQuery ? (
							<div className="text-center py-8 text-gray-500 dark:text-gray-400">
								No users found
							</div>
						) : (
							<div className="text-center py-8 text-gray-500 dark:text-gray-400">
								Start typing to search for users
							</div>
						)}
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
