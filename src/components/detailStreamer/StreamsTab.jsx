import SmallStreamCard from "./SmallStreamCard";

const StreamsTab = ({ streams }) => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {streams.map((stream, index) => (
                <SmallStreamCard
                    key={index}
                    index={index}
                    stream={stream}
                />
            ))}
        </div>
    );
}

export default StreamsTab
