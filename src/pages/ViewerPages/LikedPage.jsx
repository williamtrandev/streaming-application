import { useEffect, useState } from "react";
import { useGetLikedStreams } from "../../api/stream";
import StreamCard from "../../components/home/StreamCard";
import { useAuth } from "../../contexts/AuthContext";
import { ThumbsUp } from "lucide-react";
import { appName } from "../../constants";
import { Spin } from "antd";
import { useInView } from "react-intersection-observer";
import { liked } from "../../assets";

const LikedPage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?._id
    const [likedHistories, setLikedHistories] = useState([]);
    const { ref, inView } = useInView();

    const { data, hasNextPage, fetchNextPage, isFetching } = useGetLikedStreams(userId);
    useEffect(() => {
        if (data) {
            setLikedHistories(data.pages.flatMap(page => page.histories));
        }
    }, [data]);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        document.title = `Liked - ${appName}`;
    }, []);

    return (
        <div>
            {(likedHistories.length == 0 && auth && !isFetching) && 
                <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] gap-5">
                    <img src={liked} alt="" className="!h-[80%] rounded-lg" />
                    <p className="text-2xl font-bold">You haven't liked any streams yet.</p>
                </div>
            }
            {!auth && 
                <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] gap-5">
                    <img src={liked} alt="" className="!h-[80%] rounded-lg" />
                    <p className="text-2xl font-bold">You can only view streams you liked when you are logged in.</p>
                </div>
            }
            {auth && <div className='w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
                {likedHistories.map((history, index) => (
                    <StreamCard
                        key={index}
                        index={index}
                        stream={history.stream}
                    />
                ))}
            </div>}
            <div ref={ref} className="flex justify-center items-center">
                {(hasNextPage || isFetching) && <Spin size="large" />}
            </div>
        </div>
    );
}

export default LikedPage;
