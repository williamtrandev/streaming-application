import { streams } from "../../constants";
import SmallStreamCard from "../../components/detailStreamer/SmallStreamCard";
import { useEffect, useState } from "react";
import { useGetSavedStreams } from "../../api/stream";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { Spin } from "antd";

const StreamerStreamsPage = () => {
    let { username } = useParams();
    username = username.replace("@", "");
    const [savedStreams, setSavedStreams] = useState([]);
    const { ref, inView } = useInView();

    const { data, hasNextPage, fetchNextPage, isFetching } = useGetSavedStreams(username);
    useEffect(() => {
        if (data) {
            setSavedStreams(data.pages.flatMap(page => page.streams));
        }
    }, [data]);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

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
            <div ref={ref} className="flex justify-center items-center">
                {(hasNextPage || isFetching) && <Spin size="large" />}
            </div>
        </div>
    );
}

export default StreamerStreamsPage;
