import { useState } from "react";
import { Outlet, useLocation, useParams, Link, NavLink } from "react-router-dom";
import ProfileHeader from "../components/detailStreamer/ProfileHeader";

const StreamerInfoTabs = () => {
	let { username } = useParams();
	username = username.replace("@", "");
	const location = useLocation();
	const { pathname } = location;

	return (
		<div>
			<div className="mb-3">
				<ProfileHeader username={username} />
			</div>

			<div className="w-full">
				<div className="sticky top-18 z-99 bg-[#edf2f9] dark:bg-boxdark-2
                    flex border-b border-gray-300 dark:border-gray-600 gap-8">
					<NavLink
						to={`/@${username}`}
						className={`px-4 py-2 font-bold text-md md:text-xl ${pathname.split("/").length == 2
							? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
							: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
							}`}
					>
						Home
					</NavLink>
					<NavLink
						to={`/@${username}/streams`}
						className={({ isActive }) => `px-4 py-2 font-bold text-md md:text-xl ${isActive
							? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
							: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
							}`}
					>
						Streams
					</NavLink>
					<NavLink
						to={`/@${username}/about`}
						className={({ isActive }) => `px-4 py-2 font-bold text-md md:text-xl ${isActive
							? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
							: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
							}`}
					>
						About
					</NavLink>
				</div>
				<div className="py-4">
					<div>
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}

export default StreamerInfoTabs;
