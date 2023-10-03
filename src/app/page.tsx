'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { MouseEvent, useState, useRef } from 'react';

import H264Decoder from '@/util/H264';
import VideoConnection from '@/util/VideoConnection'
import H264Player from '@/component/H264Player';

export default function Home() {
  var decoder : H264Decoder;
  var connection : VideoConnection;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameDim, setFrameDim] =  useState({width: 0, height: 0});

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

    return lDecoder;
  }

  const startConnection = (e : MouseEvent<HTMLButtonElement>) => {
    connection = new VideoConnection();
    decoder = setupDecoder(undefined)
    connection.frameSubject.subscribe((frame) => {
      console.log("send frame to decoder");
      decoder.sendFrame(frame);
    });


    decoder.decodedFrame.subscribe((frame) => {
      setFrameDim({width: frame.displayWidth, height: frame.displayHeight})
      //TODO: are there better ways to draw the frame to an html element.
      canvasRef.current?.getContext('2d')?.drawImage(frame, 0, 0);
      frame.close();
    });
  }

  const stopConnection = (e: MouseEvent<HTMLButtonElement>) => {
    if(connection){
      connection.close();
    }
  }

  return (
   <div>
    <p>test</p>
    <button onClick={startConnection}>Connect</button>
    <button onClick={stopConnection}>Disconnect</button>
    {/* <canvas ref={canvasRef} width={frameDim.width} height={frameDim.height}/> */}
    <H264Player canvasRef={canvasRef} width={frameDim.width} height={frameDim.height} />
    
   </div>
  )
}
