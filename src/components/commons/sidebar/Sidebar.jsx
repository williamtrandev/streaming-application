import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { ChevronDown, ChevronUp, History, Moon, Podcast, ThumbsUp, Tv } from 'lucide-react';
import DarkModeSwitcher from '../header/DarkModeSwitcher';
import { appName } from '../../../constants';
import { useGetFollowedChannels } from '../../../api/user';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';


const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const location = useLocation();
	const { pathname } = location;

	const trigger = useRef(null);
	const sidebar = useRef(null);

	const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
	);

	const { auth } = useAuth();
	const userId = auth?.user?._id
	const { followedChannels, setFollowedChannels } = useUser();
	const [followedShow, setFollowedShow] = useState([]);
	const { data: followedData } = useGetFollowedChannels(userId);
	useEffect(() => {
		if (followedData) {
			setFollowedChannels(followedData.followedChannels);
			if (followedData.followedChannels.length <= 5) {
				setFollowedShow(followedData.followedChannels);
			} else {
				setFollowedShow(followedData.followedChannels.slice(0, 5));
			}
		}
	}, [followedData])

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
		localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
		if (sidebarExpanded) {
			document.querySelector('body')?.classList.add('sidebar-expanded');
		} else {
			document.querySelector('body')?.classList.remove('sidebar-expanded');
		}
	}, [sidebarExpanded]);

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
					<div className="divide-y divide-gray-300 dark:divide-gray-600">

						<ul className="mb-6 flex flex-col gap-6">
							<li>
								<NavLink
									to="/"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/' ||
										pathname.includes('home')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<Tv className='w-5' />
									<p className='text-base'>Home</p>
								</NavLink>
							</li>

							<li>
								<NavLink
									to="/history"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/history' ||
										pathname.includes('history')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<History className='w-5' />
									<p className='text-base'>History</p>
								</NavLink>
							</li>

							<li>
								<NavLink
									to="/liked"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/liked' ||
										pathname.includes('liked')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<ThumbsUp className='w-5' />
									<p className='text-base'>Liked streams</p>
								</NavLink>
							</li>

							<li>
								<NavLink
									to="/following"
									className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '/following' ||
										pathname.includes('following')) &&
										'bg-purple-600 dark:bg-meta-4 text-white'
										}`}
								>
									<Podcast className='w-5' />
									<p className='text-base'>Following</p>
								</NavLink>
							</li>

							{/* <SidebarLinkGroup
								activeCondition={
									pathname === '' || pathname.includes('followers')
								}
							>
								{(handleClick, open) => {
									return (
										<>
											<NavLink
												to="#"
												className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ${(pathname === '' ||
													pathname.includes('followers')) &&
													'bg-purple-600 dark:bg-meta-4 text-white'
													}`}
												onClick={(e) => {
													e.preventDefault();
													sidebarExpanded
														? handleClick()
														: setSidebarExpanded(true);
												}}
											>
												<Podcast className='w-5' />
												<p className='text-base'>Followed Channels</p>
												<svg
													className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
														}`}
													width="20"
													height="20"
													viewBox="0 0 20 20"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
														fill=""
													/>
												</svg>
											</NavLink>
											<div
												className={`translate transform overflow-hidden ${!open && 'hidden'
													}`}
											>
												<ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
													{followers.map((follower, index) => (
														<li key={index}>
															<NavLink
																to={`/${follower.id}`}
																className={({ isActive }) =>
																	'group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out dark:text-bodydark2 hover:font-bold dark:hover:text-white ' +
																	(isActive && '!font-bold dark:!text-white')
																}
															>
																<div className="relative flex">
																	<img src={follower.avatar} alt="" className='w-5 h-5 rounded-full' />
																	{follower.isLive &&
																		<span className="absolute -bottom-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 inline">
																			<span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
																		</span>
																	}
																</div>
																<p className='truncate flex-1'>{follower.name}</p>

															</NavLink>
														</li>

													))}
												</ul>
											</div>
										</>
									);
								}}
							</SidebarLinkGroup> */}
						</ul>
						{(followedChannels.length > 0) && <ul className="mb-6 flex flex-col gap-2">
							<li>
								<div
									className="group relative flex items-center gap-4 rounded-lg px-6 pt-3 font-medium dark:text-bodydark1 ease-in-out"
								>
									Followed channels
								</div>
							</li>
							{followedShow.map((followedChannel, index) => (
								<li key={index}>
									<NavLink
										to={`/${followedChannel.streamer.username}`}
										className={({ isActive }) =>
											'group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white ' +
											(isActive && 'bg-purple-600 dark:bg-meta-4 text-white')
										}
									>
										<div className="relative flex">
											<img src={followedChannel.streamer.profilePicture.url} alt="" className='w-6 h-6 rounded-full' />
											{followedChannel.streamer.isLive &&
												<span className="absolute -bottom-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 inline">
													<span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
												</span>
											}
										</div>
										<p className='truncate flex-1'>{followedChannel.streamer.fullname}</p>
									</NavLink>
								</li>
							))}
							{(followedShow.length === 5) && <button
								className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium 
									dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white`}
								onClick={() => setFollowedShow(followedChannels)}
							>
								<ChevronDown />
								<span>More</span>
							</button>}
							{(followedShow.length > 5) && <button
								className={`group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium 
									dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white`}
								onClick={() => setFollowedShow(followedChannels.slice(0, 5))}
							>
								<ChevronUp />
								<span>Show less</span>
							</button>}
						</ul>}
						<ul className="md:hidden">
							<li className="group relative flex items-center gap-4 rounded-lg px-6 py-2 font-medium">
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

export default Sidebar;
