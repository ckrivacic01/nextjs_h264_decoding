'use client'
import { MouseEvent, useState, useRef } from 'react';

import { VideoMessage } from '@/generated/videomessage';
import VideoConnection from '@/util/VideoConnection'
import H264Player from '@/component/H264Player';
import { Observable, Subject } from 'rxjs';
import { Button } from '@mui/material';

export default function Home() {
  var connection : VideoConnection;
  const frameSubject: Subject<VideoMessage> = new Subject<VideoMessage>();

  // const setupDecoder = (parameterSets: Uint8Array | undefined) : H264Decoder => {
  //   var lDecoder : H264Decoder;
  //   const config : VideoDecoderConfig = {
  //     //TODO: what is the correct codec string to use. Chrome and edge do not accept avc1.* but the following works avc1.420034
  //     codec: 'avc1.420034',
  //     colorSpace: {
  //     },
  //     description: parameterSets,
  //     hardwareAcceleration: 'prefer-hardware',
  //     optimizeForLatency: true,
  //   }
  //   lDecoder = new H264Decoder(config);

  //   return lDecoder;
  // }

  const startConnection = (e : MouseEvent<HTMLButtonElement>) => {
    connection = new VideoConnection();
    // decoder = setupDecoder(undefined)
    connection.frameSubject.subscribe((frame) => {
      console.log("publishing video frame on frameSubject");
      frameSubject.next(frame);
    });


    // decoder.decodedFrame.subscribe((frame) => {
    //   // setFrameDim({width: frame.displayWidth, height: frame.displayHeight})
    //   // //TODO: are there better ways to draw the frame to an html element.
    //   // canvasRef.current?.getContext('2d')?.drawImage(frame, 0, 0);
    //   frameSubject.next(frame);
    //   frame.close();
    // });
  }

  const stopConnection = (e: MouseEvent<HTMLButtonElement>) => {
    if(connection){
      connection.close();
      frameSubject.complete();
    }
  }

  const observable = frameSubject.asObservable();
  return (
   <div>
    <p>test</p>
    <Button variant="contained" onClick={startConnection}>Connect</Button>
    <Button variant="outlined" onClick={stopConnection}>Disconnect</Button>
    {/* <canvas ref={canvasRef} width={frameDim.width} height={frameDim.height}/> */}
    <H264Player frameObservable={observable} />
    
   </div>
  )
}
