'use client';

import { useRef, useState, useEffect, use } from "react";
import { Observable } from "rxjs";

import H264Decoder from "@/util/H264";
import { VideoMessage } from "@/generated/videomessage";

type H264PlayerProps = {
    frameObservable: Observable<VideoMessage>
}

function H264Player(props: H264PlayerProps){

    

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

        console.log("subscribing to decoder frame observable");
        decoder.decodedFrame.subscribe((frame) => {
          canvasRef.current?.getContext('2d')?.drawImage(frame, 0, 0);
          setDim({width: frame.displayWidth, height: frame.displayHeight});
          setTotalFrames(totalFrames + 1);
          frame.close();
        });

        console.log("subscrining to frame observable");
        props.frameObservable
        .subscribe((videoMessage) => {
            decoder.sendFrame(videoMessage);
        });
      },[]);


    const [dim, setDim] = useState({width: 0, height: 0});
    const [totalFrames, setTotalFrames] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    //listen for decoded frames and draw them to the canvas
    // decoderRef.current.decodedFrame.subscribe((frame) => {
    //     canvasRef.current?.getContext('2d')?.drawImage(frame, 0, 0);
    //     setDim({width: frame.displayWidth, height: frame.displayHeight});
    //     setTotalFrames(totalFrames + 1);
    //     //release resources held by the frame
    //     // frame.close();
    // });
    
    //incoming frames will go to the decoder. Decoder will emmit VideoFrames when they are ready
    // props.frameObservable
    // .subscribe((videoMessage) => {
    //     decoderRef.current.sendFrame(videoMessage);
    // });
        

  return(
    <div>
        <p>frames: {totalFrames}</p>
        <canvas ref={canvasRef} width={dim.width} height={dim.height}/>
    </div>
  )

}

export default H264Player;