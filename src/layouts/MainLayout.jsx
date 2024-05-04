import { useState, useEffect } from 'react';
import { Navbar } from '../components';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
	const [isDark, setDark] = useState(false);
	const changeTheme = (currentIsDark) => {
		setDark(!currentIsDark);
		localStorage.setItem("isDarkWilliam", !currentIsDark);
		console.log("isDark", isDark);
		currentIsDark === true ? document.body.classList.remove("dark") : document.body.classList.add("dark");
	};
	useEffect(() => {
		const initialIsDark = localStorage.getItem('isDarkWilliam') === 'true';
		changeTheme(!initialIsDark);
	}, []);
	return (
		<div className='relative z-0 bg-body min-h-screen'>
			<div className='relative'>
				<div className='gradient-01'></div>
				<div className='gradient-02'></div>
				<Navbar isDark={isDark} changeTheme={changeTheme} />
			</div>
			<div className='relative z-0'>
				<div className='gradient-03'></div>
			</div>
			<div className="pt-[5rem]">
				<Outlet />
			</div>
		</div>
	)
}

export default MainLayout;