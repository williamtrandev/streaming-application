import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../../constants";
import { lightmode, darkmode } from "../../assets";
import { SearchIcon } from "lucide-react";

const Navbar = ({ isDark, changeTheme }) => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (scrollTop > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`w-full flex items-center px-10 py-6 fixed top-0 z-[100] 
				${scrolled ? "bg-navbar" : "bg-transparent"}`}
		>

			<div className='w-full flex justify-between items-center mx-auto'>
				{/* Left side */}
				<div className="flex space-x-20">
					<Link
						to='/'
						className='flex items-center gap-2'
						onClick={() => {
							setActive("");
							window.scrollTo(0, 0);
						}}
					>
						<p className='text-nav-color text-[18px] font-bold cursor-pointer flex'>
							William Tran
						</p>
					</Link>

					<ul className='list-none hidden md:flex flex-row gap-10 items-center'>
						{navLinks.map((nav) => (
							<Link to={nav.to}>
								<li
									key={nav.id}
									className='text-nav-color text-md cursor-pointer'
								>
									{nav.title}
								</li>
							</Link>
						))}
					</ul>
				</div>
				{/* Right side */}
				<div className="flex space-x-20 ml-auto">
					<div className="flex items-center text-sm text-slate-400 rounded-3xl ring-1 ring-slate-900/10 shadow-sm bg-search">
						<div className="pl-4 pr-2">
							<SearchIcon />
						</div>
						<input
							type="text"
							placeholder="Search..."
							className="w-full px-4 py-2 rounded-lg outline-none bg-transparent"
						/>
					</div>
					<ul className='list-none hidden md:flex flex-row gap-10 items-center'>
						<li className={`text-nav-color text-md font-medium cursor-pointer space-x-2`}>
							<button className="border rounded-md py-2 px-4">Đăng kí</button>
							<button className="border rounded-md py-2 px-4">Đăng nhập</button>
						</li>
						<li
							className={`w-[80px] h-[35px] rounded-[20px] ${isDark === true ? `bg-[url('/src/assets/darkmode.jpg')]` : `bg-[url('/src/assets/lightmode.jpg')]`} bg-cover bg-center relative transition-all duration-500 cursor-pointer`}
							onClick={() => changeTheme(isDark)}
						>
							<div className={`absolute top-0 'left-0' ${isDark === false ? '' : 'translate-x-[47px]'} w-[33px] h-[35px] bg-white rounded-full ease-in duration-300`}></div>
						</li>
					</ul>
				</div>
			</div>

		</nav>
	);
};

export default Navbar;