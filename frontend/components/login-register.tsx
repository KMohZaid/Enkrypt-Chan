"use client";
import { Heart, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/lib/config";

import type { User } from "@/types";

interface LoginRegisterProps {
	onLogin: (user: User) => void;
}

export default function LoginRegister({ onLogin }: LoginRegisterProps) {
	const [loginForm, setLoginForm] = useState({ username: "", password: "" });
	const [registerForm, setRegisterForm] = useState({
		name: "",
		username: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("login");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const formData = new URLSearchParams();
			formData.append("username", loginForm.username);
			formData.append("password", loginForm.password);

			const response = await fetch(`${API_URL}/token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				onLogin({
					username: data.username,
					name: data.name,
					token: data.access_token,
				});
			} else {
				setError("Invalid credentials. Please try again!");
			}
		} catch (err) {
			setError("Connection failed. Is the server running?");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch(`${API_URL}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: registerForm.name.trim(),
					username: registerForm.username.trim(),
					password: registerForm.password,
				}),
			});

			if (response.ok) {
				setError("");
				setActiveTab("login");
				setLoginForm({
					username: registerForm.username,
					password: registerForm.password,
				});
				setRegisterForm({ name: "", username: "", password: "" });
			} else {
				const errorData = await response.json();
				setError(errorData.detail || "Registration failed");
			}
		} catch (err) {
			setError("Connection failed. Is the server running?");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-gray-800">
			<div className="w-full max-w-md">
				<div className="absolute top-4 right-4">
					<ThemeToggle />
				</div>
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-4">
						<div className="relative">
							<Image
								src="/waifu.png"
								alt="Enkrypt-Chan Logo"
								width={64}
								height={64}
								className="rounded-full border-4 border-pink-300 shadow-lg dark:border-purple-400"
								crossOrigin="anonymous"
							/>
							<div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
								<Heart className="h-3 w-3 text-white animate-pulse" />
							</div>
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-purple-400">
								Enkrypt-Chan
							</h1>
							<div className="flex items-center justify-center gap-1 mt-1">
								<Sparkles className="h-4 w-4 text-purple-500 animate-pulse dark:text-purple-400" />
								<span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
									Cute & Secure
								</span>
								<Sparkles className="h-4 w-4 text-pink-500 animate-pulse dark:text-pink-400" />
							</div>
						</div>
					</div>
					<p className="text-gray-600 font-medium dark:text-gray-300">
						{"Welcome to the cutest chat app! (ﾉ◕ヮ◕)ﾉ*:･✧"}
					</p>
				</div>
				<Card className="border-2 border-pink-200 shadow-xl bg-white/80 backdrop-blur-sm dark:border-purple-600 dark:bg-gray-800/90">
					<CardHeader className="text-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg dark:bg-gradient-to-r dark:from-gray-800 dark:to-purple-900/50">
						<CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
							Join the Fun!
						</CardTitle>
						<CardDescription className="text-gray-600 dark:text-gray-300">
							Login or create an account
							<br />
						</CardDescription>
					</CardHeader>
					<CardContent className="p-6">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-2 bg-pink-100 dark:bg-gray-700">
								<TabsTrigger
									value="login"
									className="data-[state=active]:bg-pink-500 data-[state=active]:text-white font-semibold dark:data-[state=active]:bg-pink-600"
								>
									Login
								</TabsTrigger>
								<TabsTrigger
									value="register"
									className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-semibold dark:data-[state=active]:bg-purple-600"
								>
									Register
								</TabsTrigger>
							</TabsList>
							<TabsContent value="login" className="space-y-4 mt-6">
								<form onSubmit={handleLogin} className="space-y-4">
									<div>
										<Input
											type="text"
											placeholder="Username"
											value={loginForm.username}
											onChange={(e) =>
												setLoginForm({ ...loginForm, username: e.target.value })
											}
											className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 dark:border-purple-600 dark:focus:border-pink-400 dark:bg-gray-700 dark:text-gray-100"
											required
										/>
									</div>
									<div>
										<Input
											type="password"
											placeholder="Password"
											value={loginForm.password}
											onChange={(e) =>
												setLoginForm({ ...loginForm, password: e.target.value })
											}
											className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 dark:border-purple-600 dark:focus:border-pink-400 dark:bg-gray-700 dark:text-gray-100"
											required
										/>
									</div>
									<Button
										type="submit"
										disabled={isLoading}
										className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2 transition-all duration-200 transform hover:scale-105 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-700 dark:hover:to-pink-800"
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Logging in...
											</>
										) : (
											"Login ♡"
										)}
									</Button>
								</form>
							</TabsContent>
							<TabsContent value="register" className="space-y-4 mt-6">
								<form onSubmit={handleRegister} className="space-y-4">
									<div>
										<Input
											type="text"
											placeholder="Display Name (e.g., Chika Fujiwara)"
											value={registerForm.name}
											onChange={(e) =>
												setRegisterForm({
													...registerForm,
													name: e.target.value,
												})
											}
											className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-600 dark:focus:border-purple-400 dark:bg-gray-700 dark:text-gray-100"
											required
										/>
									</div>
									<div>
										<Input
											type="text"
											placeholder="Choose a username"
											value={registerForm.username}
											onChange={(e) =>
												setRegisterForm({
													...registerForm,
													username: e.target.value,
												})
											}
											className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-600 dark:focus:border-purple-400 dark:bg-gray-700 dark:text-gray-100"
											required
										/>
									</div>
									<div>
										<Input
											type="password"
											placeholder="Create a password"
											value={registerForm.password}
											onChange={(e) =>
												setRegisterForm({
													...registerForm,
													password: e.target.value,
												})
											}
											className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-600 dark:focus:border-purple-400 dark:bg-gray-700 dark:text-gray-100"
											required
										/>
									</div>
									<Button
										type="submit"
										disabled={isLoading}
										className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 transition-all duration-200 transform hover:scale-105 dark:from-purple-600 dark:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800"
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Creating account...
											</>
										) : (
											"Register ✨"
										)}
									</Button>
								</form>
							</TabsContent>
						</Tabs>
						{error && (
							<div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm text-center dark:bg-red-900/30 dark:border-red-600 dark:text-red-300">
								{error}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
