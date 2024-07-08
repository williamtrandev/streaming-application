import { useEffect, useState } from "react";
import { useGetLikedStreams } from "../../api/stream";
import StreamCard from "../../components/home/StreamCard";
import { useAuth } from "../../contexts/AuthContext";
import { ThumbsUp } from "lucide-react";
import { appName } from "../../constants";
import { Spin } from "antd";
import { useInView } from "react-intersection-observer";

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
            {(likedHistories.length == 0 && auth && !isFetching) && <div className="h-full flex flex-col items-center justify-center gap-4">
                <ThumbsUp size={64} />
                <span className="text-lg">You haven't liked any streams yet.</span>
            </div>}
            {!auth && <div className="h-full flex flex-col items-center justify-center gap-4">
                <ThumbsUp size={64} />
                <span className="text-lg">You can only view streams you liked when you are logged in.</span>
            </div>}
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
