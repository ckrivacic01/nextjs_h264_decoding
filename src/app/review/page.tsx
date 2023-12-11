"use client"

import EventList from "@/component/EventList";
import Hls from "hls.js"
import React, {useEffect, useRef} from "react";
import { from } from "rxjs";
import { ArtsentryEvent } from "@/component/types";
import { HLSPlayerProps } from "@/component/types";
import { PlayBackService } from "@/util/PlaybackService";
import { VcsRestAuthenticate, VcsServerContext } from "@acuity-vct/vcs-client-api/dist";



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
const serverContext = new VcsServerContext({host: "localhost", port:443, httpSchema:"https"});
export default function Review() {
  const [eventUrl, setEventUrl] = React.useState<string>();
  
    const events = [
      { type: "motion", recId: "1234" },
      { type: "lighting", recId: "4321" },
    ]
    return(
        <div>
            <h1>Event Review</h1>
              
            {eventUrl && <HLSPlayer src={eventUrl}/> }
            
            <EventList events={events} eventClick={(e) => eventSelected(e, setEventUrl)} />
        </div>
    )
}

function eventSelected(event: ArtsentryEvent, setPlaybackUrl: (url: string) => void): void{
  // event.recId = '1688584326689:VCS_DEV_INT_4'
  event.recId= '1666989609324:test'
  console.log(`event selected id=${event.recId}`);
  const playbackService = new PlayBackService(serverContext);
  if(!serverContext.userSession.isLoggedIn()){
    console.log("not logged in");
    new VcsRestAuthenticate(serverContext).login("admin", "system").then((session) => {
      playbackService.reviewEvent(event).then((srcUrl) => {
        console.log(`srcUrl=${srcUrl}`);
        setPlaybackUrl(srcUrl)
      });
    });
  }else{
    
    playbackService.reviewEvent(event).then((srcUrl) => {
      console.log(`srcUrl=${srcUrl}`);
      setPlaybackUrl(srcUrl);
    });
  }
  
}