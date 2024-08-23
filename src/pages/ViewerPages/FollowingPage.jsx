import StreamCard from "../../components/home/StreamCard";
import { useGetFollowingStreams } from "../../api/stream";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Podcast } from "lucide-react";
import { appName } from "../../constants";
import { Spin } from "antd";
import { useInView } from "react-intersection-observer";
import { following } from "../../assets";

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
            {(followingStreams.length == 0 && auth && !isFetching) && 
                <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] gap-5">
                    <img src={following} alt="" className="!h-[80%] rounded-lg" />
                    <p className="text-2xl font-bold">You haven't followed any channels yet.</p>
                </div>
            }
            {!auth && 
                <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] gap-5">
					<img src={following} alt="" className="!h-[80%] rounded-lg" />
					<p className="text-2xl font-bold">You can only view your following channels's streams when you are logged in.</p>
				</div>
            }
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