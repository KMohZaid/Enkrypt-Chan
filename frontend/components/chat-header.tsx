import { LogOut, Settings, Wifi, WifiOff } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

interface ChatHeaderProps {
	user: User;
	isConnected: boolean;
	onLogout: () => void;
	onProfileOpen: () => void;
}

export default function ChatHeader({
	user,
	isConnected,
	onLogout,
	onProfileOpen,
}: ChatHeaderProps) {
	return (
		<div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/95 dark:border-gray-700">
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-3">
					<Image
						src="/waifu.png"
						alt="Enkrypt-Chan"
						width={32}
						height={32}
						className="rounded-full border-2 border-pink-300 dark:border-purple-400"
						crossOrigin="anonymous"
					/>
					<div>
						<h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
							Enkrypt-Chan
						</h1>
						<div className="flex items-center gap-2">
							{isConnected ? (
								<Wifi className="h-3 w-3 text-green-500" />
							) : (
								<WifiOff className="h-3 w-3 text-red-500" />
							)}
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{isConnected ? "Connected" : "Connecting..."}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2 ml-4">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={`https://i.pravatar.cc/32?u=${user.username}`}
							/>
							<AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
								{user.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium text-gray-800 dark:text-gray-200">
							{user.name}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Button
						variant="ghost"
						size="sm"
						onClick={onProfileOpen}
						className="text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400"
					>
						<Settings className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onLogout}
						className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
					>
						<LogOut className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
