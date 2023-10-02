'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { MouseEvent } from 'react';

import H264Decoder from '@/util/H264';
import VideoConnection from '@/util/VideoConnection'

export default function Home() {

  const handleDecodeInit = (e: MouseEvent<HTMLButtonElement>) => {
    const config : VideoDecoderConfig = {
      codec: 'avc1.*',
      colorSpace: {
        primaries: 'bt709',
        transfer: 'bt709',
        matrix: 'rgb',
      },
      hardwareAcceleration: 'prefer-hardware',
      optimizeForLatency: true,
    }
    const decoder = new H264Decoder(config);

    //TODO: get a stream of h264 and provide it to the decoder as EncodedVideoChunk
    
  }

  const startConnection = (e : MouseEvent<HTMLButtonElement>) => {
    const connection = new VideoConnection();

  }

  return (
   <div>
    <p>test</p>
    <button onClick={handleDecodeInit}>Decode</button>
    <button onClick={startConnection}>Connect</button>
   </div>
  )
}
