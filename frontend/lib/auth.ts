import type { User } from "@/types";

export const saveUserToLocalStorage = (user: User) => {
	localStorage.setItem("enkrypt-chan-user", JSON.stringify(user));
};

export const loadUserFromLocalStorage = (): User | null => {
	const savedUser = localStorage.getItem("enkrypt-chan-user");
	if (savedUser) {
		try {
			return JSON.parse(savedUser);
		} catch (error) {
			console.error("Failed to parse saved user:", error);
			localStorage.removeItem("enkrypt-chan-user");
		}
	}
	return null;
};

export const removeUserFromLocalStorage = () => {
	localStorage.removeItem("enkrypt-chan-user");
};
