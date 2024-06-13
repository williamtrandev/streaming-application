import { streams } from "../../constants";
import SmallStreamCard from "../../components/detailStreamer/SmallStreamCard";
import { useEffect, useState } from "react";
import { useGetSavedStreams } from "../../api/stream";
import { useParams } from "react-router-dom";

const StreamerStreamsPage = () => {
    const { username } = useParams();
    const [savedStreams, setSavedStreams] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { data, refetch } = useGetSavedStreams({ username, page });
    useEffect(() => {
        if (data) {
            if (page == 1) {
                setSavedStreams(data.streams);
            } else {
                setSavedStreams((prevStreams) => [...prevStreams, ...data.streams]);
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

    return (
        <div>
            {savedStreams.length == 0 && <div
                className="text-xl"
            >
                This channel has not saved any streams yet
            </div>}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {savedStreams.map((stream, index) => (
                    <SmallStreamCard
                        key={index}
                        index={index}
                        stream={stream}
                    />
                ))}
            </div>
        </div>
    );
}

export default StreamerStreamsPage;
