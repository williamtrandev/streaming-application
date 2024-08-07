import { Link, useLocation, useNavigate } from 'react-router-dom';
import DarkModeSwitcher from './DarkModeSwitcher';
import { LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { logo } from '../../../assets';
import { toast } from 'react-toastify';
const HeaderAdmin = (props) => {

    const { logout } = useAuth();
	const handleLogout = () => {
		toast.info('You have been logout', {
			position: "bottom-right"
		});
		logout();
		// logoutUser();
	}

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
                        <img src={logo} alt="Logo" className='w-10 h-10 rounded-full' />
                    </Link>
                </div>
                <div className="flex w-full items-center justify-end gap-2 2xsm:gap-4">
                    <div className="hidden md:block">
                        <DarkModeSwitcher />
                    </div>
                    <button
                        className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium dark:text-bodydark1 duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-meta-4 hover:text-white"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5" />
                        <div>
                            Log Out
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;
