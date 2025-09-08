import { useState, useRef } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useSidebar } from "./Layout";

const ProfileCard = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isMobile, setSidebarHidden } = useSidebar();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [lastInteraction, setLastInteraction] = useState(0);

	// Double-click protection
	const handleMenuClick = () => {
		const now = Date.now();
		if (now - lastInteraction < 300) return;
		setLastInteraction(now);
		setIsOpen(false);
		if (isMobile) {
			setSidebarHidden(true);
		}
	};

	return (
		<div className="relative mx-4 mb-4">
			<button
				ref={buttonRef}
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						setIsOpen(!isOpen);
					}
				}}
				className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-4 rounded-lg w-full transition-colors duration-200"
				aria-expanded={isOpen}
				aria-haspopup="menu"
			>
				<div className="flex justify-center items-center bg-orange-500 rounded-full w-10 h-10">
					<User className="w-5 h-5 text-white" />
				</div>
				<div className="flex-1 text-left">
					<div className="font-semibold dark:text-white text-sm">John Doe</div>
					<div className="text-gray-500 dark:text-gray-400 text-xs">Administrator</div>
				</div>
				<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			{isOpen && (
				<div 
					ref={dropdownRef}
					className="right-0 bottom-full left-0 z-50 absolute bg-white dark:bg-slate-800 shadow-lg mb-2 py-2 border border-gray-200 dark:border-slate-700 rounded-lg"
					role="menu"
				>
					<button
						onClick={handleMenuClick}
						onKeyDown={(e) => {
							if (e.key === 'ArrowDown') {
								e.preventDefault();
								(e.currentTarget.nextElementSibling as HTMLElement)?.focus();
							}
						}}
						className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-2 w-full text-gray-700 dark:text-gray-300 text-sm"
						role="menuitem"
					>
						<User className="w-4 h-4" />
						<span>Profile Settings</span>
					</button>
					<button
						onClick={handleMenuClick}
						onKeyDown={(e) => {
							if (e.key === 'ArrowUp') {
								e.preventDefault();
								(e.currentTarget.previousElementSibling as HTMLElement)?.focus();
							} else if (e.key === 'ArrowDown') {
								e.preventDefault();
								(e.currentTarget.nextElementSibling?.nextElementSibling as HTMLElement)?.focus();
							}
						}}
						className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-2 w-full text-gray-700 dark:text-gray-300 text-sm"
						role="menuitem"
					>
						<Settings className="w-4 h-4" />
						<span>Preferences</span>
					</button>
					<hr className="my-2 border-gray-200 dark:border-slate-700" />
					<button
						onClick={handleMenuClick}
						onKeyDown={(e) => {
							if (e.key === 'ArrowUp') {
								e.preventDefault();
								(e.currentTarget.previousElementSibling?.previousElementSibling as HTMLElement)?.focus();
							}
						}}
						className="flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 w-full text-red-600 dark:text-red-400 text-sm"
						role="menuitem"
					>
						<LogOut className="w-4 h-4" />
						<span>Sign Out</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileCard;
