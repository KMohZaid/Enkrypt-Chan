import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function hasTimezone(isoString: string) {
	return /(?:Z|[+-]\d{2}:\d{2})$/.test(isoString);
}

// Ensures there is timezone ending in "Z" or "+00:00"
// if for some reason backend timestamp is missing timezone
function ensureTimezone(isoString: string) {
	return hasTimezone(isoString) ? isoString : isoString + "Z";
}

export function formatTime(timestamp: string | null) {
	if (!timestamp) return "";

	try {
		const date = new Date(ensureTimezone(timestamp));
		return isNaN(date.getTime())
			? ""
			: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	} catch {
		return "";
	}
}

export function formatDate(timestamp: string | null) {
	if (!timestamp) return "";

	try {
		const date = new Date(timestamp);
		if (isNaN(date.getTime())) return null;
		const today = new Date();
		if (date.toDateString() === today.toDateString()) return "Today";
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
		return date.toLocaleDateString([], {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return null;
	}
}

export function shortenText(text: string | null, maxLength: number = 25) {
	if (!text) {
		return "";
	}
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(0, maxLength) + "...";
}
