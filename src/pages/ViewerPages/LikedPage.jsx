import { useEffect, useState } from "react";
import { useGetLikedStreams } from "../../api/stream";
import StreamCard from "../../components/home/StreamCard";
import { useAuth } from "../../contexts/AuthContext";
import { ThumbsUp } from "lucide-react";

const LikedPage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?._id
    const [likedHistories, setLikedHistories] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { data, refetch } = useGetLikedStreams(userId, page);
    useEffect(() => {
        if (data) {
            if (page == 1) {
                setLikedHistories(data.histories);
            } else {
                setLikedHistories((prevStreams) => [...prevStreams, ...data.histories]);
            }
            setHasMore(data.histories.length > 0);
        }
    }, [data])

    useEffect(() => {
        if (hasMore && page > 1) {
            refetch();
        }
    }, [page]);

    useEffect(() => {
        if (auth) {
            refetch();
        }
    }, [auth]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            setPage((prevPage) => prevPage + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            {(likedHistories.length == 0 && auth) && <div className="h-full flex flex-col items-center justify-center gap-4">
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
        </div>
    );
}

export default LikedPage;
