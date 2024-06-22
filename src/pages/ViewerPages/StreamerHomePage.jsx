import StreamCard from "../../components/home/StreamCard";
import HorizontalStreamCard from "../../components/detailStreamer/HorizontalStreamCard";
import Carousel from "../../components/detailStreamer/Carousel";
import { useEffect, useState } from "react";
import { useGetHomeStreams } from "../../api/stream";
import { useParams } from "react-router-dom";

const StreamerHomePage = () => {
    let { username } = useParams();
    username = username.replace("@", "");
	const [currentStream, setCurrentStream] = useState(null);
    const [mostViewedStreams, setMostViewedStreams] = useState([]);
    const [mostLikedStreams, setMostLikedStreams] = useState([]);
    const { data } = useGetHomeStreams(username);
    useEffect(() => {
        if (data) {
            setCurrentStream(data.currentStream);
            setMostViewedStreams(data.mostViewedStreams);
            setMostLikedStreams(data.mostLikedStreams);
        }
    }, [data]);
    return (
        <div className="w-full divide-y divide-gray-300 dark:divide-gray-600">
            {(!currentStream && mostViewedStreams.length === 0 && mostLikedStreams.length === 0) && <div
                className="text-xl"
            >
                This channel has not saved any streams yet
            </div>}
            {currentStream && <div className="pb-4">
                <div className="hidden md:block">
                    <HorizontalStreamCard stream={currentStream} />
                </div>
                <div className="md:hidden">
                    <StreamCard stream={currentStream} />
                </div>
            </div>}
            {mostViewedStreams.length > 0 && <div className="py-4">
                <div className="font-bold text-xl">Most viewed streams</div>
                <div className="mt-4">
                    <Carousel streams={mostViewedStreams} />
                </div>
            </div>}
            {mostLikedStreams.length > 0 && <div className="py-4">
                <div className="font-bold text-xl">Most liked streams</div>
                <div className="mt-4">
                    <Carousel streams={mostLikedStreams} />
                </div>
            </div>}
        </div>
    );
}

export default StreamerHomePage;
