'use client'
import { MouseEvent, useState, useRef, use, useEffect } from 'react';

import { H264VideoMessage, VideoMessage } from '@/generated/videomessage';
import VideoConnection from '@/util/VideoConnection'
import H264Player from '@/component/H264Player';
import { Observable, Subject, connectable, map, merge, range, toArray } from 'rxjs';
import { Button, Grid, TextField } from '@mui/material';

const host : string = "192.168.2.44"
const port : number = 80;

export default function Home() {
  var connection: VideoConnection;
  const [totalCameras, setTotalCameras] = useState("1");
  const [cameraNumber, setCameraNumber] = useState<number>(2)
  const frameSubject: Subject<VideoMessage> = new Subject<VideoMessage>()

  useEffect(() => {
    console.log("Camera number changed number=" + cameraNumber);
  }, [cameraNumber])


  const startConnection = (e: MouseEvent<HTMLButtonElement>) => {
    connection = new VideoConnection(host, port)
    // decoder = setupDecoder(undefined)
    connection.frameSubject.subscribe((frame) => {
      console.log("publishing video frame on frameSubject");
      frameSubject.next(frame);
    });
  }

  const stopConnection = (e: MouseEvent<HTMLButtonElement>) => {
    if (connection) {
      connection.close();
      frameSubject.complete();
    }
  }

  const observable = frameSubject.asObservable();
  return (
    <div>

      <Button variant="contained" onClick={startConnection}>Connect</Button>
      <Button variant="outlined" onClick={stopConnection}>Disconnect</Button>
      <TextField id="outlined-basic" label="number of cameras" variant="outlined" value={totalCameras} onChange={(e) => setTotalCameras(e.target.value)} />
      <TextField id="outlined-basic" label="camera number" variant="outlined" value={cameraNumber} onChange={(e) => setCameraNumber(Number(e.target.value))} />


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Array.from(Array(Number(totalCameras))).map((_, index) => (
          <Grid item xs={4} sm={4} md={1} key={index}>
            <H264Player frameObservable={observable} size={100} cameraNumber={cameraNumber}/>
          </Grid>
        ))}
      </Grid>



    </div>
  )
}
