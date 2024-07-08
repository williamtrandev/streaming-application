import { useLocation } from "react-router-dom";
import ChannelsCarousel from "../../components/search/ChannelsCarousel";
import { useEffect, useState } from "react";
import { useSearchStreams } from "../../api/search";
import StreamCard from "../../components/home/StreamCard";
import { appName } from "../../constants";
import { Spin } from "antd";
import { useInView } from "react-intersection-observer";

const SearchPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const { ref, inView } = useInView();

    const [streams, setStreams] = useState([]);

    const { data, hasNextPage, fetchNextPage, isFetching } = useSearchStreams(q);
    useEffect(() => {
        if (data) {
            setStreams(data.pages.flatMap(page => page.streams));
        }
    }, [data]);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

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
            <div>
                <div className="py-5 w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {streams.map((stream, index) => (
                        <StreamCard
                            key={index}
                            index={index}
                            stream={stream}
                        />
                    ))}
                </div>
                <div ref={ref} className="flex justify-center items-center">
                    {(hasNextPage || isFetching) && <Spin size="large" />}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
