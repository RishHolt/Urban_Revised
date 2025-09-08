import { Bell, Filter, Menu, Search } from 'lucide-react';
import React from 'react';
import { Button } from '@heroui/button';

interface HeaderProps {
  onToggleSidebar: () => void;
  breadcrumb?: string[];
}

function Header({ onToggleSidebar, breadcrumb = ['Dashboard'] }: HeaderProps) {
  const [theme, setTheme] = React.useState('');

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className='flex bg-white/-80 dark:bg-slate-800 backdrop-blur-xl px-6 py-2 border-slate-200 dark:border-slate-700/50 border-b min-h-20'>
      <div className='flex justify-between items-center w-full'>
        {/* left */}
        <div className='flex items-center space-x-4 w-full'>
          <Button
            isIconOnly
            variant="light"
            className='hover:bg-slate-200 p-2 rounded-lg text-slate-500 transition-colors duration-200'
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className='w-6 h-6' />
          </Button>
          <div>
            <div className='hidden md:flex items-center space-x-1'>
              <h1 className='font-bold text-md dark:text-white'>URBAN PLANNING, ZONING & HOUSING</h1>
            </div>
            <div>
              <span className='font-bold text-slate-500 text-xs'>
                {breadcrumb.join(' > ')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-fit">
			{/* Search Bar */}
			<div className='flex-1 mr-4 ml-8 w-full max-w-lg'>
				<div className='relative w-72'>
					<Search className='top-1/2 left-3 absolute w-5 h-5 text-slate-500 -translate-y-1/2 transform' />
					<input
						type='text'
						placeholder='Search...'
						className='bg-slate-100 py-2 pr-4 pl-10 border border-slate-200 hover:border-orange-300 focus:border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 w-full transition-all placeholder-slate-500'
					/>
					<Button
						isIconOnly
						variant="light"
						className='top-1/2 right-2 absolute p-1 text-slate-400 hover:text-slate-600 -translate-y-1/2 transform'
						aria-label="Filter"
					>
						<Filter className='w-5 h-5' />
					</Button>
				</div>
			</div>

			{/* right side*/}
			<div className='flex items-center space-x-1'>
			{/* notification */}
			<Button
				isIconOnly
				variant="light"
				className='relative hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl text-slate-600 dark:hover:text-slate-100 dark:text-slate-400 transition-colors cursor-pointer'
				aria-label="Notifications"
			>
				<Bell className='w-6 h-6' />
				<span className='top-0 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 text-white text-xs'>1</span>
			</Button>

			{/* dark mode toggle */}
			<Button
				isIconOnly
				variant="light"
				className='bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-900 ml-2 p-2 rounded-xl text-slate-600 dark:text-yellow-400 transition-colors cursor-pointer'
				onClick={toggleTheme}
				aria-label='Toggle dark mode'
			>
				{theme === 'dark' ? (
				// Sun icon for light mode
				<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
					<path stroke="currentColor" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.46 6.46L5.05 5.05m13.9 0l-1.41 1.41M6.46 17.54l-1.41 1.41" />
				</svg>
				) : (
				// Moon icon for dark mode
				<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke="currentColor" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
				</svg>
				)}
			</Button>
			</div>
		</div>
      </div>
    </div>
  );
}

export default Header;
