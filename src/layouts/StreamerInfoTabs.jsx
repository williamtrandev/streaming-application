import { useState } from "react";
import { Outlet, useLocation, useParams, Link } from "react-router-dom";
import ProfileHeader from "../components/detailStreamer/ProfileHeader";
import { fakeStreamer } from "../constants";

const StreamerInfoTabs = () => {
    const { id } = useParams();
    const location = useLocation();
	const { pathname } = location;

    const tabData = [
		{ id: 0, label: "Home", link: "" },
		{ id: 1, label: "Streams", link: "streams" },
		{ id: 2, label: "About", link: "about" },
	];

    const streamer = fakeStreamer;

    return (
        <div>
            <div className="mb-3">
                <ProfileHeader streamer={streamer} />
            </div>

			<div className="w-full">
				<div className="sticky top-18 z-99 bg-[#edf2f9] dark:bg-boxdark-2
                    flex border-b border-gray-300 dark:border-gray-600 gap-8">
					{tabData.map((tab) => (
						<Link
							to={tab.label === "Home" ? `/${id}` : `/${id}/${tab.link}`}
							key={tab.id}
							className={`px-4 py-2 font-bold text-md md:text-xl ${(pathname.split("/").length == 2 && tab.link == "") || pathname.split("/")[2] === tab.link
								? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
								: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
								}`}
						>
							{tab.label}
						</Link>
					))}
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
