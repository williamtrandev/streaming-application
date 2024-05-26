import { streams } from "../../constants";
import StreamCard from "../../components/home/StreamCard";
import HorizontalStreamCard from "../../components/detailStreamer/HorizontalStreamCard";
import Carousel from "../../components/detailStreamer/Carousel";

const StreamerHomePage = () => {
	const currentStream = streams[0];
    const mostViewedStream = streams;
    const mostLikedStream = streams; 
    return (
        <div className="w-full divide-y divide-gray-300 dark:divide-gray-600">
            <div className="pb-4">
                <div className="hidden md:block">
                    <HorizontalStreamCard stream={currentStream} />
                </div>
                <div className="block md:hidden">
                    <StreamCard stream={currentStream} />
                </div>
            </div>
            <div className="py-4">
                <div className="font-bold text-xl">Most viewed streams</div>
                <div className="mt-4">
                    <Carousel streams={mostViewedStream} />
                </div>
            </div>
            <div className="py-4">
                <div className="font-bold text-xl">Most liked streams</div>
                <div className="mt-4">
                    <Carousel streams={mostLikedStream} />
                </div>
            </div>
        </div>
    );
}

export default StreamerHomePage;
