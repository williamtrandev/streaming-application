import { Link } from "react-router-dom";
import FollowButton from "../detailStreamer/FollowButton";
import { formatNumFollowers } from "../../utils/formatNumber";
import { useEffect, useState } from "react";

const Streamer = ({ user }) => {
    const [numFollowers, setNumFollowers] = useState(0);
    useEffect(() => {
        if (user) {
            setNumFollowers(user.numFollowers)
        }
    }, user)
	return (
		<div className="w-full items-center bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<div className="w-full md:flex md:justify-between">
				<Link
					to={`/@${user?.username}`}
					className="flex gap-3"
				>
					<img src={user?.profilePicture} alt="" className="rounded-full w-[3rem] h-[3rem] object-cover" />
					<div>
						<div className="text-lg font-bold">{user?.fullname}</div>
						<div>{formatNumFollowers(numFollowers)} followers</div>
					</div>
				</Link>

				<div className="flex items-center ml-15 mt-1 md:ml-4 md:mt-0">
					<FollowButton streamerId={user?._id} streamerName={user?.fullname} setNumFollowers={setNumFollowers} />
				</div>
			</div>
		</div>
	);
}

export default Streamer;
