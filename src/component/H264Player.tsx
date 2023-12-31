'use client';

import { useRef, useState, useEffect, use } from "react";
import { Observable, animationFrameScheduler, filter, map, observeOn } from "rxjs";

import H264Decoder from "@/util/H264";
import { VideoMessage } from "@acuity-vct/vcs-client-api/dist";

type H264PlayerProps = {
    frameObservable: Observable<VideoMessage>
    size: number,
    cameraNumber: number,
}

function H264Player(props: H264PlayerProps){

  const [totalFrames, setTotalFrames] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(0);
  const fpsCalculationRef = useRef({startTime: 0});

    const setupDecoder = (parameterSets: Uint8Array | undefined) : H264Decoder => {
        var lDecoder : H264Decoder;
        const config : VideoDecoderConfig = {
          //TODO: what is the correct codec string to use. Chrome and edge do not accept avc1.* but the following works avc1.420034
          codec: 'avc1.420034',
          colorSpace: {
          },
          description: parameterSets,
          hardwareAcceleration: 'prefer-hardware',
          optimizeForLatency: true,
        }
        lDecoder = new H264Decoder(config);
        console.log("created h264 decoder");
        return lDecoder;
      }
      
      useEffect(() => {
        const decoder = setupDecoder(undefined);
        var startTime : number = 0;
    
        console.log("subscribing to decoder frame observable");
        decoder.decodedFrame.pipe(observeOn(animationFrameScheduler)).subscribe((frame) => {
  
          const now = performance.now();
          canvasRef.current?.getContext('2d')?.drawImage(frame, 0, 0, props.size, props.size);
          // setDim({width: frame.displayWidth, height: frame.displayHeight});
          var newFrames = totalFrames + 1;
          setTotalFrames(n => n + 1);
          frame.close();
        });

        console.log("subscribing to frame observable");
        const subscription = props.frameObservable
        .pipe(
          map((videoMessage) => {
            const h264VideoMessage = videoMessage.frame;
                        if(h264VideoMessage.oneofKind == "h264VideoMessage"){
                            const message = h264VideoMessage.h264VideoMessage;
                            console.log(`got video message iframe=${message.iframe} camera=${videoMessage.videoStreamKey?.cameraNumber} nalUnitSize=${message.nalUnit.length} isParameterSet=${message.isParameterSet}`);
                            return message;
                        }
          }),
        )
        .subscribe((videoMessage) => {
          if(videoMessage){
            console.log("sending frame to decoder")
            decoder.sendFrame(videoMessage);
          }
        });

        return () => {
          decoder.decoder.close();
          subscription.unsubscribe();
        };
      },[props.cameraNumber]);

      useEffect(() => {
        if (fpsCalculationRef.current.startTime == 0) {
          fpsCalculationRef.current.startTime = performance.now();
        } else {
          const elapsed = (performance.now() - fpsCalculationRef.current.startTime) / 1000;
          const fps = totalFrames / elapsed;
          console.log("fps=" + fps + "totalFrames=" + totalFrames)
          // setStatus("render", `${fps.toFixed(0)} fps`);
          setFps(fps);
        }
        console.log("totalframes changed" +totalFrames)
      }, [totalFrames]);
  

  return(
    <div>
        <p>cameraNumber{props.cameraNumber}</p>
        <p>frames: {totalFrames}</p>
        <p>FPS: {fps.toFixed(0)}</p>
        <canvas ref={canvasRef} width={props.size} height={props.size}/>
    </div>
  )

}

export default H264Player;