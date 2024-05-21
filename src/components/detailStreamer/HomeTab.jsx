import StreamCard from "../home/StreamCard";
import Carousel from "./Carousel";
import HorizontalStreamCard from "./HorizontalStreamCard";

const HomeTab = ({ currentStream, mostLikedStream, mostViewedStream }) => {
    return (
        <div className="w-full divide-y">
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

export default HomeTab
