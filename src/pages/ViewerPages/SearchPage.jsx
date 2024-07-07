import { useLocation } from "react-router-dom";
import ChannelsCarousel from "../../components/search/ChannelsCarousel";
import { useEffect, useState } from "react";
import { useSearchStreams } from "../../api/search";
import StreamCard from "../../components/home/StreamCard";
import { appName } from "../../constants";
import { Spin } from "antd";

const SearchPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [streams, setStreams] = useState([]);

    const { data: streamsData, refetch, isPending } = useSearchStreams({ key: q, page });
    useEffect(() => {
        if (streamsData) {
            if (page == 1) {
                setStreams(streamsData.streams);
            } else {
                setStreams((prevStreams) => [...prevStreams, ...streamsData.streams]);
            }
            setHasMore(streamsData.streams.length > 0);
        }
    }, [streamsData])

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
        document.title = `${q} - ${appName}`;
    }, []);

    return (
        <div className="space-y-4 divide-y divide-gray-300 dark:divide-gray-600">
            <div
                className="text-lg"
            >
                Search result for "<span className="font-semibold">{q}</span>"
            </div>
            <ChannelsCarousel q={q} />
            <div className="py-5 w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {streams.map((stream, index) => (
                    <StreamCard
                        key={index}
                        index={index}
                        stream={stream}
                    />
                ))}
            </div>
            {isPending && <div className="flex justify-center items-center">
                <Spin size="large" />
            </div>}
        </div>
    );
}

export default SearchPage;
