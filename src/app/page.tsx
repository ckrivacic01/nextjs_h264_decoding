'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { MouseEvent } from 'react';

import H264Decoder from '@/util/H264';
import VideoConnection from '@/util/VideoConnection'
import { connect } from 'http2';

export default function Home() {
  var decoder : H264Decoder;
  var connection : VideoConnection;
  const handleDecodeInit = (e: MouseEvent<HTMLButtonElement>) => {
    decoder = setupDecoder(undefined);

    //TODO: get a stream of h264 and provide it to the decoder as EncodedVideoChunk
    
  }

  const setupDecoder = (parameterSets: Uint8Array | undefined) : H264Decoder => {
    var lDecoder : H264Decoder;
    const config : VideoDecoderConfig = {
      codec: 'avc1.*',
      colorSpace: {
      },
      description: parameterSets,
      hardwareAcceleration: 'no-preference',
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
      // if(frame.isParameterSet){
      //   decoder = setupDecoder(frame.nalUnit)
      // }else{
      //   decoder.sendFrame(frame);
      // }
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
   </div>
  )
}
