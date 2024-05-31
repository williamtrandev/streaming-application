import { Link, useLocation } from 'react-router-dom';
import DropdownNotification from '../header/DropdownNotification';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownUser from '../header/DropdownUser';
import LogoIcon from '../../../assets/lightmode.jpg';
import { LogIn, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Header = (props) => {
	const location = useLocation();
	const { pathname } = location;
	const isStudioPath = location.pathname.includes('studio');
	const [showSmallSearch, setShowSmallSearch] = useState(false);
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const searchRef = useRef(null);

	// const logged = true;
	const logged = false;

	const handleClickOutside = (event) => {
		if (searchRef.current && !searchRef.current.contains(event.target)) {
			setIsSearchVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className="sticky top-0 z-999 flex w-full h-20 bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
			<div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
				<div className="flex items-center gap-2 sm:gap-4 lg:hidden">
					<button
						aria-controls="sidebar"
						onClick={(e) => {
							e.stopPropagation();
							props.setSidebarOpen(!props.sidebarOpen);
						}}
						className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
					>
						<span className="relative block h-5.5 w-5.5 cursor-pointer">
							<span className="du-block absolute right-0 h-full w-full">
								<span
									className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300'
										}`}
								></span>
								<span
									className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full'
										}`}
								></span>
								<span
									className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500'
										}`}
								></span>
							</span>
							<span className="absolute right-0 h-full w-full rotate-45">
								<span
									className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-[0]'
										}`}
								></span>
								<span
									className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-200'
										}`}
								></span>
							</span>
						</span>
					</button>
					
					<Link className="block flex-shrink-0 lg:hidden" to="/">
						<img src="https://avatars.githubusercontent.com/u/102520170?v=4" alt="Logo" className='w-10 h-10 rounded-full' />
					</Link>
				</div>
				{!isStudioPath && 
					<div className="hidden sm:block">
						<form>
							<div className="relative bg-[#edf2f9] shadow-md dark:bg-meta-4 p-2 rounded-lg">
								<input
									type="search"
									placeholder="Type to search..."
									className="w-full bg-transparent pr-9 pl-4 text-black focus:outline-none dark:text-white xl:w-125"
								/>
								<button className="absolute right-3 top-1/2 -translate-y-1/2">
									<svg
										className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
										width="20"
										height="20"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
											fill=""
										/>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
											fill=""
										/>
									</svg>
								</button>
							</div>
						</form>
					</div>
				}

				{isSearchVisible && <div ref={searchRef}
					className="absolute -bottom-1/2 right-0 w-full border-b border-stroke dark:border-black">
					<form>
						<div className="relative bg-gray dark:bg-meta-4 p-2">
							<input
								type="search"
								placeholder="Type to search..."
								className="w-full bg-transparent pr-9 pl-4 text-black focus:outline-none dark:text-white xl:w-125"
							/>
							<button className="absolute right-3 top-1/2 -translate-y-1/2">
								<svg
									className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
										fill=""
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
										fill=""
									/>
								</svg>
							</button>
						</div>
					</form>
				</div>}
				{isStudioPath && <div></div>}
				<div className="flex items-center gap-3 2xsm:gap-7">
					<ul className="flex items-center gap-2 2xsm:gap-4">
						<button className="block sm:hidden"
							onClick={() => setIsSearchVisible(!isSearchVisible)}
						>
							<Search className="h-8.5 w-8.5 p-1.5 rounded-full border-[0.5px] border-stroke bg-gray dark:border-strokedark dark:bg-meta-4 
								dark:text-white" />
						</button>
						<div className="hidden md:block">
							<DarkModeSwitcher />
						</div>

						<DropdownNotification />
						{logged && <DropdownUser />}
						{!logged && <div>
							<button className="flex gap-1 px-2 py-1 text-white rounded-lg
								bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500"
								onClick={() => props.setShowLoginModal(true)}
							>
								<LogIn />
								Login
							</button>
						</div>}
					</ul>
				</div>
			</div>
		</header>
	);
};

export default Header;
