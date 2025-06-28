"use client";

import { Edit2, Heart, Save, Shield, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { User } from "@/types";

interface ProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: User;
}

export default function ProfileModal({
	isOpen,
	onClose,
	user,
}: ProfileModalProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(user.name);
	const [status, setStatus] = useState("Available");

	const handleSave = () => {
		// In a real app, you would save to the backend here
		setIsEditing(false);
	};

	const handleCancel = () => {
		setName(user.name);
		setIsEditing(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-pink-500" />
						Profile Settings
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					<div className="flex flex-col items-center space-y-4">
						<div className="relative">
							{/* TODO: Add a actual avatar for user and use that from api */}
							<Avatar className="h-24 w-24">
								<AvatarImage
									src={`https://i.pravatar.cc/250?u=${user.username}`}
								/>
								<AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
									{name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
								<Heart className="h-4 w-4 text-white" />
							</div>
						</div>
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								value={user.username}
								disabled
								className="bg-gray-50 dark:bg-gray-800"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="name">Display Name</Label>
							<div className="flex gap-2">
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={!isEditing}
									className={isEditing ? "" : "bg-gray-50 dark:bg-gray-800"}
								/>
								{!isEditing ? (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditing(true)}
										className="px-3"
									>
										<Edit2 className="h-4 w-4" />
									</Button>
								) : (
									<div className="flex gap-1">
										<Button
											variant="outline"
											size="sm"
											onClick={handleSave}
											className="px-3 text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
										>
											<Save className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={handleCancel}
											className="px-3 text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Input
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								disabled={!isEditing}
								className={isEditing ? "" : "bg-gray-50 dark:bg-gray-800"}
							/>
						</div>
					</div>
					<div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
						<Image
							src="/waifu.png"
							alt="Enkrypt-Chan"
							width={24}
							height={24}
							className="rounded-full"
							crossOrigin="anonymous"
						/>
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Powered by Enkrypt-Chan ♡
						</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
