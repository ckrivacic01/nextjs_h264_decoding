"use client"

import Hls from "hls.js"
import React, {useEffect, useRef} from "react";
import { from } from "rxjs";

interface HLSPlayerProps{
    src: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({src}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        const hls = new Hls();
        const video = videoRef.current;
    
        if (Hls.isSupported()) {
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            video.play();
          });
        }
    }, [src]);
    return <video ref={videoRef} controls />
};

export default function Settings() {

    return(
        <div>
            <h1>Event Review</h1>
            <HLSPlayer src="https://192.168.2.44/api/v1/playback/1b484355-c9f7-474f-8c7a-a2b9e2b33e6a/playlist.m3u8"/>
        </div>
    )
}