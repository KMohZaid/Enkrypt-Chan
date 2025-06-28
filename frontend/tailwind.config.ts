import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Waifu-inspired color palette
				pink: {
					25: "#fef7f7",
					50: "#fdf2f8",
					100: "#fce7f3",
					200: "#fbcfe8",
					300: "#f9a8d4",
					400: "#f472b6",
					500: "#ec4899",
					600: "#db2777",
					700: "#be185d",
					800: "#9d174d",
					900: "#831843",
				},
				purple: {
					25: "#faf8ff",
					50: "#f5f3ff",
					100: "#ede9fe",
					200: "#ddd6fe",
					300: "#c4b5fd",
					400: "#a78bfa",
					500: "#8b5cf6",
					600: "#7c3aed",
					700: "#6d28d9",
					800: "#5b21b6",
					900: "#4c1d95",
				},
				gray: {
					25: "#fcfcfd",
					50: "#f9fafb",
					100: "#f3f4f6",
					200: "#e5e7eb",
					300: "#d1d5db",
					400: "#9ca3af",
					500: "#6b7280",
					600: "#4b5563",
					700: "#374151",
					800: "#1f2937",
					900: "#111827",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontFamily: {
				sans: [
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"sans-serif",
				],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				"pulse-pink": "pulse-pink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			backgroundImage: {
				"gradient-chika":
					"linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fce7f3 100%)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;
