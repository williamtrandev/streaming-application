import StreamCard from "../../components/home/StreamCard";
import { useGetFollowingStreams } from "../../api/stream";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Podcast } from "lucide-react";
import { appName } from "../../constants";
import { Spin } from "antd";
const FollowingPage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?._id;
	const [followingStreams, setFollowingStreams] = useState([]);
    const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

    const { data, refetch, isPending } = useGetFollowingStreams(userId, page);
    useEffect(() => {
        if (data) {
            if (page == 1) {
                setFollowingStreams(data.streams);
            } else {
                setFollowingStreams((prevStreams) => [...prevStreams, ...data.streams]);
            }
            setHasMore(data.streams.length > 0);
        }
    }, [data])

    useEffect(() => {
        if (hasMore && page > 1) {
            refetch();
        }
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            setPage((prevPage) => prevPage + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.title = `Following - ${appName}`;
    }, []);

	return (
        <div>
            {(followingStreams.length == 0 && auth && !isPending) && <div className="h-full flex flex-col items-center justify-center gap-4">
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
            {isPending && auth && <div className="flex justify-center items-center">
                <Spin size="large" />
            </div>}
        </div>
	)
}

export default FollowingPage;