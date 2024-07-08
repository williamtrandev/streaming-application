import StreamCard from "../../components/home/StreamCard";
import { useGetFollowingStreams } from "../../api/stream";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Podcast } from "lucide-react";
import { appName } from "../../constants";
import { Spin } from "antd";
import { useInView } from "react-intersection-observer";
const FollowingPage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?._id;
    const [followingStreams, setFollowingStreams] = useState([]);
    const { ref, inView } = useInView();

    const { data, hasNextPage, fetchNextPage, isFetching } = useGetFollowingStreams(userId);
    useEffect(() => {
        if (data) {
            setFollowingStreams(data.pages.flatMap(page => page.streams));
        }
    }, [data]);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        document.title = `Following - ${appName}`;
    }, []);

    return (
        <div>
            {(followingStreams.length == 0 && auth && !isFetching) && <div className="h-full flex flex-col items-center justify-center gap-4">
                <Podcast size={64} />
                <span className="text-lg">You haven't followed any channels yet.</span>
            </div>}
            {!auth && <div className="h-full flex flex-col items-center justify-center gap-4">
                <Podcast size={64} />
                <span className="text-lg">You can only view your following channels's streams when you are logged in.</span>
            </div>}
            {auth && <div className='w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                {followingStreams.map((stream, index) => (
                    <StreamCard
                        key={index}
                        index={index}
                        stream={stream}
                    />
                ))}
            </div>}
            <div ref={ref} className="flex justify-center items-center">
                {(hasNextPage || isFetching) && <Spin size="large" />}
            </div>
        </div>
    )
}

export default FollowingPage;