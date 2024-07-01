import {
    StartAudio,
    useConnectionState,
    useRemoteParticipant,
    useTracks,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { connectionStateMapping } from "../../utils/livekit";
import ObsVideoControlHeader from "./ObsVideoControlHeader";

const StreamerObsVideoControl = ({ streamId }) => {
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(streamId);
    let content;
    const tracks = useTracks([
        Track.Source.ScreenShare
    ]).filter(
        (track) => track.participant.identity === streamId
    );
    if (connectionState !== ConnectionState.Connected || !participant) {
        content = (
            <div className="grid aspect-video items-center justify-center bg-black text-sm uppercase text-white">
                {connectionState === ConnectionState.Connected
                    ? "Stream is offline"
                    : connectionStateMapping(connectionState)}
            </div>
        )
    } else if (tracks.length === 0) {
        content = (
            <div className="flex aspect-video items-center justify-center bg-black text-sm uppercase text-white">
                <div className="flex gap-2">
                    <div className="h-4 w-4 rounded-full bg-neutral-400 animate-bounce delay-100" />
                    <div className="h-4 w-4 rounded-full bg-neutral-500 animate-bounce delay-200" />
                    <div className="h-4 w-4 rounded-full bg-neutral-600 animate-bounce delay-300" />
                </div>
            </div>
        );
    } else {
        content = <StreamerRemote participant={participant} />
    }
    return (
        <div className="flex flex-col justify-center gap-4 px-4 py-2 h-full bg-meta-4 rounded-lg">
            <ObsVideoControlHeader streamId={streamId} isStreaming={participant} />
            {content}
        </div>
    );
}

const StreamerRemote = ({ participant }) => {
    const videoEl = useRef(null);
    const playerEl = useRef(null);
    useTracks([
        Track.Source.ScreenShare
    ])
        .filter((track) => track.participant.identity === participant.identity)
        .forEach((track) => {
            if (videoEl.current) {
                track.publication.track?.attach(videoEl.current);
            }
        });

    return (
        <div className="aspect-video rounded-lg overflow-hidden" ref={playerEl}>
            <video ref={videoEl} width="100%" height="100%" />
        </div>
    )
}

export default StreamerObsVideoControl