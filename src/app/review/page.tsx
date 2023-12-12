"use client"

import EventList from "@/component/EventList";
import Hls from "hls.js"
import React, {useEffect, useRef} from "react";
import { from } from "rxjs";
import { ArtsentryEvent } from "@/component/types";
import { HLSPlayerProps } from "@/component/types";
import { PlayBackService } from "@/util/PlaybackService";
import { VcsRestAuthenticate, VcsServerContext, VcsWsConnector, SessionEvent, SessionEventType, SubscriptionApi, VcsSubscriptionCategory, EventProcessor } from "@acuity-vct/vcs-client-api/dist";




const HLSPlayer: React.FC<HLSPlayerProps> = ({src}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [videoTime, setVideoTime] = React.useState<number>(0);
    useEffect(() => {
        if (!videoRef.current) return;
        const hls = new Hls();
        const video = videoRef.current;
    
        if (Hls.isSupported()) {
          console.log("HLS supported loading source=" + src);
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            console.log("manifest parsed")
            video.play();
          });

          hls.on(Hls.Events.ERROR, function (event, data) {
            console.log("HLS error event=" + event + " data=" + JSON.stringify(data));
          });
          hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            video.play();
          });
        }

        video.addEventListener("timeupdate", () => {
          setVideoTime(video.currentTime);
        });

        return () => {
          if(videoRef.current){
            video.removeAttribute('src');
            video.load();
          }
          if(hlsRef.current){
            console.log("destroying current hls ref")
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
        }
    }, [src]);
    return (
      <>
        <p>video time: {videoTime}</p>
        <video ref={videoRef} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
      </>
      
    );
    
    
};
const serverContext = new VcsServerContext({host: "192.168.2.44", port:443, httpSchema:"https", wsSchema: "wss"});
const wsVcs = new VcsWsConnector(serverContext);
const eventProcessor = new EventProcessor(wsVcs);
  
export default function Review() {
  const [eventUrl, setEventUrl] = React.useState<string>();
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false)
  useEffect(() => {
    console.log("Review page useEffect setting up connections");
    setupConnections().then(() => setLoggedIn(true));
  }, []);

  return (
    <div>
      <h1>Event Review</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {loggedIn && <EventList eventProcessor={eventProcessor} eventClick={(e) => eventSelected(e, setEventUrl)} /> }
        <div>
          <p>playbackUrl:{eventUrl}</p>
          {eventUrl && <HLSPlayer src={eventUrl} />}
        </div>

      </div>
    </div>
  )
}

function setupConnections() : Promise<void>{
  return new Promise((resolve, reject) => {
    if(!serverContext.userSession.isLoggedIn()){
      const authApi = new VcsRestAuthenticate(serverContext);
  
      authApi.login("admin", "system")
    .then(() => {
     
      const session = wsVcs.subscribeSession(event => {
        if (event.type === SessionEventType.NewSession) {
          const sessionId: string = event.data;
          const subscriptions = new SubscriptionApi({
            accessToken: serverContext.userSession.token,
            basePath: serverContext.basePath
          });
          subscriptions.addSubscription({
            category: VcsSubscriptionCategory.Event,
            spec: {}
          }, sessionId)
            .then(response => {
              console.log("addSubscription response " + JSON.stringify(response));
            })
            .catch(err => {
              console.error("addSubscription error " + err);
            });
          resolve();
        } else {
          console.log("session event: " + JSON.stringify(event));
        }
      });
      
      wsVcs.connect("/api/v1/push");
    })
    .catch(err => {
      console.error(err.message)
      reject(err);
    });
    
    }
  });
  
}

function eventSelected(event: ArtsentryEvent, setPlaybackUrl: (url: string) => void): void{
  console.log(`event selected id=${event.recId}`);
  const playbackService = new PlayBackService(serverContext);
  if(!serverContext.userSession.isLoggedIn()){
    console.log("not logged in");
  }else{
    playbackService.reviewEvent(event).then((srcUrl) => {
      console.log(`srcUrl=${srcUrl}`);
      //hack to allow the server to create the playlist. Server returns imediatly while playlist is not created yet
      // new Promise(resolve => setTimeout(resolve, 1000)).then(() => setPlaybackUrl(srcUrl));
      setPlaybackUrl(srcUrl);
      
    });
  }
  
}