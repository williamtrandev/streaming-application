import { useLocation } from "react-router-dom";
import ChannelsCarousel from "../../components/search/ChannelsCarousel";
import { useEffect, useState } from "react";
import { useSearchStreams } from "../../api/search";
import StreamCard from "../../components/home/StreamCard";

const SearchPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const q = params.get('q');

    const [streams, setStreams] = useState([]);

    const { data: streamsData } = useSearchStreams(q);
    useEffect(() => {
        if (streamsData) {
            setStreams(streamsData.streams);
        }
    }, [streamsData]);

    return (
        <div className="space-y-4 divide-y divide-gray-300 dark:divide-gray-600">
            <div
                className="text-lg"
            >
                Search result for "<span className="font-semibold">{q}</span>"
            </div>
            <div className="space-y-2 pt-2">
                <div>Channels</div>
                <div>
                    <ChannelsCarousel q={q} />
                </div>
            </div>
            <div className="py-5 w-full mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {streams.map((stream, index) => (
                    <StreamCard
                        key={index}
                        index={index}
                        stream={stream}
                    />
                ))}
            </div>
        </div>
    );
}

export default SearchPage;
