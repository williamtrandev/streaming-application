import { useSelector } from "react-redux";
import { selectSocket } from "../../redux/slices/socketSlice";
import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { formatNumViewers } from "../../utils/formatNumber";
import { useEndStream, useStartStream } from "../../api/studio";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ObsVideoControlHeader = ({ streamId, isStreaming }) => {
    const navigate = useNavigate();
    const socket = useSelector(selectSocket);
    const [isStarted, setIsStarted] = useState(false);
    const [egressId, setEgressId] = useState(null);
    const [numViewers, setNumViewers] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const { mutate: startStream, isSuccess: isStartStreamSuccess, isError: isStartStreamError, data: startStreamData } = useStartStream();
    const { mutate: endStream, isError: isEndError, isSuccess: isEndSuccess } = useEndStream();

    useEffect(() => {
        let timer;
        if (isStreaming) {
            setStartTime(Date.now());
            timer = setInterval(() => {
                setCurrentTime(Date.now());
            }, 1000);
            startStream(streamId);
            setIsStarted(true);
        } else {
            if (isStarted) {
                endStream({ streamId, egressId });
            }
            clearInterval(timer);
            setStartTime(null);
        }
        return () => clearInterval(timer);
    }, [isStreaming]);

    const getElapsedTime = (start, end) => {
        const elapsed = end - start;
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

        return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        socket.emit('joinRoom', streamId);
        socket.on('updateViewers', (data) => {
            if (data.streamId === streamId) {
                console.log(data)
                setNumViewers(data.viewers);
            }
        });

        return () => {
            socket.emit('leaveStream', streamId);
        };
    }, [streamId]);

    useEffect(() => {
        if (startStreamData && startStreamData.egressId) {
            setEgressId(startStreamData.egressId);
        }
    }, [isStartStreamSuccess]);

    useEffect(() => {
        toast.error("Starting streaming failed");
    }, [isStartStreamError])

    useEffect(() => {
		if (isEndError) {
			toast.error("Oops! Something went wrong");
		}
		if (isEndSuccess) {
			toast.success("End successfully!");
            navigate(`/studio/manager`);
		}
	}, [isEndError, isEndSuccess])

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-[5px] text-lg font-bold">
                {isStreaming ? (
                    <div className="flex items-center gap-1">
                        <span className="relative mr-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                        </span>
                        <div>LIVE
                            <span className="ml-3 italic text-purple-500">
                                {getElapsedTime(startTime, currentTime)}
                            </span>
                        </div>
                    </div>
                ) : (
                    "Ready to stream"
                )}
            </div>
            <div className="flex gap-2 items-center space-x-3">
                <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 ml-3 italic text-purple-500" />
                    <p>{formatNumViewers(numViewers)}</p>
                </div>
            </div>
        </div>
    );
}

export default ObsVideoControlHeader;
