import Image from "next/image";

export default function ChatWelcome() {
	return (
		<div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="text-center">
				<div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
					<Image
						src="/waifu.png"
						alt="Enkrypt-Chan"
						width={80}
						height={80}
						className="rounded-full"
						crossOrigin="anonymous"
					/>
				</div>
				<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
					Welcome to Enkrypt-Chan! ♡
				</h3>
				<p className="text-gray-600 dark:text-gray-400">
					Select a conversation or start a new chat
				</p>
			</div>
		</div>
	);
}
