import { Calendar, ThumbsDown, ThumbsUp, Timer, Users, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { formatNumFollowers, formatNumLikes, formatNumViewers } from "../../utils/formatNumber";
import FollowButton from "../detailStreamer/FollowButton";
import { Link } from "react-router-dom";
import StreamVideoControl from "./StreamVideoControl";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from "antd";
import { useGetStreamRecord } from "../../api/studio";
const Streamer = ({ user }) => {
	return (
		<div className="w-full items-center bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<div className="w-full md:flex md:justify-between">
				<Link 
					to={`/${user?._id}`}
					className="flex gap-3"
				>
					<img src={user?.profilePicture} alt="" className="rounded-full w-[3rem] h-[3rem] object-cover" />
					<div>
						<div className="text-lg font-bold">{user?.fullname}</div>
						<div>{formatNumFollowers(user?.numFollowers)} followers</div>
					</div>
				</Link>

				<div className="flex items-center ml-15 mt-1 md:ml-4 md:mt-0">
					<FollowButton streamerId={user._id} streamerName={user.fullname} />
				</div>
			</div>
		</div>
	);
}

const StreamDescription = ({ stream }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<div className="w-full items-center space-y-3 bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<h3 className="font-bold text-2xl w-full">{stream?.title}</h3>
			<div className="flex justify-between">
				<div className="space-y-1">
					<div className="flex gap-2">
						{/* <Timer className="w-[1rem]" />
						<span>09:02:20</span> */}
						<Calendar className="w-[1rem]" />
						<span>{stream?.dateStream && new Date(stream?.dateStream).toLocaleString()}</span>
					</div>
					<div className="flex gap-2">
						<Users className="w-[1rem]" />
						<span>{formatNumViewers(stream?.numViewers)}</span>
					</div>
				</div>
				<div className="flex divide-x-2 divide-white dark:divide-boxdark mb-4 text-xs md:text-base">
					<button className="px-2 py-1 md:px-4 md:py-2 rounded-l-full flex gap-2 items-center
						bg-neutral-300 dark:bg-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white">
						<ThumbsUp size={20} />
						{formatNumLikes(stream?.numLikes)}
					</button>
					<button className="px-2 py-1 md:px-4 md:py-2 rounded-r-full flex gap-2 items-center
						bg-neutral-300 dark:bg-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white">
						<ThumbsDown size={20} />
						{formatNumLikes(stream?.numDislikes)}
					</button>
				</div>
			</div>
			<div className={isExpanded ? "flex flex-col gap-4" : ""}>
				{isExpanded ? stream?.description : `${stream?.description?.substring(0, 200)}...`}
				{
				stream?.description?.length > 200 && 
					<button
						className="px-1 rounded-lg bg-neutral-200 dark:bg-neutral-700
							hover:bg-neutral-300 dark:hover:bg-neutral-600 w-fit text-start"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? "Show less" : "More"}
					</button>
				}
			</div>
		</div>
	)
}


const RecordStreamVideo = ({ streamData }) => {
	const videoEl = useRef(null);
	const streamId = streamData?.stream?._id;
	const { auth } = useAuth();
	const userId = auth?.user?._id || uuidv4();
    const { data: recordData } = useGetStreamRecord(streamId);
    useEffect(() => {
        if (recordData) {
            videoEl.current.src = recordData.streamLink;
        }
    }, [recordData]);
	return (
		<div className="w-full flex flex-col items-center space-y-3">
			<Streamer user={streamData?.stream?.user} />
			<div className="flex flex-1 flex-col w-full">
				<div className="flex h-full flex-1">
					<div className="flex-1 flex-col container rounded-lg overflow-hidden">
                        <div className="relative flex aspect-video bg-black">
                            <video ref={videoEl} width="100%" controls />
                        </div>
					</div>
				</div>
			</div>
			<StreamDescription stream={streamData?.stream} />
		</div>
	)
}

export default RecordStreamVideo;