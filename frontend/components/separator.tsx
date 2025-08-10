import React from "react";

interface SeparatorProps {
	message?: string;
}
export default function Separator({ message = "Separator" }: SeparatorProps) {
	return (
		<div className="relative my-4 flex items-center">
			<div className="flex-grow border-t border-pink-500/30 dark:border-pink-500/20" />
			<span className="flex-shrink mx-4 text-xs font-semibold text-pink-500">
				{message}
			</span>
			<div className="flex-grow border-t border-pink-500/30 dark:border-pink-500/20" />
		</div>
	);
}
