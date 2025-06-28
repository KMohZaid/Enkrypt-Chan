"use client";

import { useEffect, useState } from "react";
import ChatLayout from "@/components/chat-layout";
import LoginRegister from "@/components/login-register";
import {
	loadUserFromLocalStorage,
	removeUserFromLocalStorage,
	saveUserToLocalStorage,
} from "@/lib/auth";
import type { User } from "@/types";

export default function Home() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const savedUser = loadUserFromLocalStorage();
		if (savedUser) {
			setUser(savedUser);
		}
		setIsLoading(false);
	}, []);

	const handleLogin = (userData: User) => {
		setUser(userData);
		saveUserToLocalStorage(userData);
	};

	const handleLogout = () => {
		setUser(null);
		removeUserFromLocalStorage();
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-300">
						Loading Enkrypt-Chan...
					</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return <LoginRegister onLogin={handleLogin} />;
	}

	return <ChatLayout user={user} onLogout={handleLogout} />;
}
