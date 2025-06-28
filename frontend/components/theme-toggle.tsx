"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-white/80 backdrop-blur-sm dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-800/50 dark:bg-gray-800/80"
		>
			<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
