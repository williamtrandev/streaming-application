import { appName, streams } from "../../constants";
import StreamCard from "../../components/home/StreamCard";
import { useEffect, useState } from "react";
import { useGetHomePageStreams } from "../../api/stream";
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
	const [followingStreams, setFollowingStreams] = useState([]);
	const [randomStreams, setRandomStreams] = useState([]);
	const [recommendStreams, setRecommendStreams] = useState([]);
	const { auth } = useAuth();
	const userId = auth ? auth.user._id : "";
	const { data } = useGetHomePageStreams(userId);
	useEffect(() => {
		if (data) {
			setFollowingStreams(data.followingStreams);
			setRandomStreams(data.randomStreams);
			setRecommendStreams(data.recommendStreams)
		}
	}, [data]);

	useEffect(() => {
        document.title = appName;
    }, []);

	return (
		<div className="divide-y divide-gray-300 dark:divide-gray-600">
			<div className="pb-5">
				<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
					{randomStreams?.map((stream, index) => (
						<StreamCard
							key={index}
							index={index}
							stream={stream}
						/>
					))}
				</div>
			</div>
			{followingStreams?.length > 0 && <div className="space-y-2 pb-5">
				<div className="text-xl font-bold pt-4">Following</div>
				<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
					{followingStreams.map((stream, index) => (
						<StreamCard
							key={index}
							index={index}
							stream={stream}
						/>
					))}
				</div>
			</div>}
			{recommendStreams?.length > 0 && <div className="space-y-2 pb-5">
				<div className="text-xl font-bold pt-4">You might like</div>
				<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
					{recommendStreams.map((stream, index) => (
						<StreamCard
							key={index}
							index={index}
							stream={stream}
						/>
					))}
				</div>
			</div>}
		</div>
	);
}

export default HomePage;