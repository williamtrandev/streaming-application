import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { Moon, Settings, Telescope, Tv, LineChart, Podcast, FileVideo } from 'lucide-react';
import DarkModeSwitcher from '../header/DarkModeSwitcher';
import { appName } from '../../../constants';


const SidebarStudio = ({ sidebarOpen, setSidebarOpen }) => {

	const location = useLocation();
	const { pathname } = location;

	const trigger = useRef(null);
	const sidebar = useRef(null);

	const storedSidebarExpanded = localStorage.getItem('sidebar-studio-expanded');
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
	);

	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current || !trigger.current) return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener('click', clickHandler);
		return () => document.removeEventListener('click', clickHandler);
	});

	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener('keydown', keyHandler);
		return () => document.removeEventListener('keydown', keyHandler);
	});

	useEffect(() => {
		localStorage.setItem('sidebar-studio-expanded', sidebarExpanded.toString());
		if (sidebarExpanded) {
			document.querySelector('body')?.classList.add('sidebar-studio-expanded');
		} else {
			document.querySelector('body')?.classList.remove('sidebar-studio-expanded');
		}
	}, [sidebarExpanded]);
	if (pathname.startsWith('/studio/stream')) {
		return null;
	}
	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-999 flex h-screen w-70 flex-col overflow-y-hidden duration-300 ease-linear bg-white dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
		>
			<div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
				<NavLink to="/" className="flex items-center space-x-4">
					<img src="https://avatars.githubusercontent.com/u/102520170?v=4" alt="Logo" className='w-15 h-15 rounded-full' />
					<p className="font-bold">{appName}</p>
				</NavLink>

				<button
					ref={trigger}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-controls="sidebar"
					aria-expanded={sidebarOpen}
					className="block lg:hidden"
				>
					<svg
						className="fill-current"
						width="20"
						height="18"
						viewBox="0 0 20 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
							fill=""
						/>
					</svg>
				</button>
			</div>

			<div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
				<nav className="pb-4 px-4 lg:px-6">
					<div>
						<ul className="mb-6 flex flex-col gap-6">
							<li>
								<NavLink
									to="manager"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/studio/manager' ||
										pathname.includes('manager')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<Podcast className='w-5' />
									<p className='text-base'>Stream Manager</p>
								</NavLink>
							</li>

							<li>
								<NavLink
									to="analytics"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/studio/analytics' ||
										pathname.includes('analytics')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<LineChart className='w-5' />
									<p className='text-base'>Analytics</p>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="community"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/studio/community' ||
										pathname.includes('community')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<Telescope className='w-5' />
									<p className='text-base'>Community</p>
								</NavLink>
							</li>
							<li>
								<NavLink
									to="saved"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/studio/saved' ||
										pathname.includes('saved')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<FileVideo className='w-5' />
									<p className='text-base'>Saved Streams</p>
								</NavLink>
							</li>
							<li className="md:hidden group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium">
								<Moon />
								<DarkModeSwitcher />
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</aside>
	);
};

export default SidebarStudio;
