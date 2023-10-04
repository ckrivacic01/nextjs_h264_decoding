'use client'
import { MouseEvent, useState, useRef } from 'react';

import { VideoMessage } from '@/generated/videomessage';
import VideoConnection from '@/util/VideoConnection'
import H264Player from '@/component/H264Player';
import { Observable, Subject, map, range, toArray } from 'rxjs';
import { Button, Grid } from '@mui/material';

export default function Home() {
  var connection: VideoConnection;
  const frameSubject: Subject<VideoMessage> = new Subject<VideoMessage>();


  const startConnection = (e: MouseEvent<HTMLButtonElement>) => {
    connection = new VideoConnection();
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

  const numberOfCameras = range(0, 30);
  const observable = frameSubject.asObservable();

  const cameraViews = [];
  for (let i = 0; i < 8; i++) {
    cameraViews.push(
      <Grid item xs={2} key={i}>
        {/* <H264Player frameObservable={observable}/> */}
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg/600px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg" />
      </Grid>
    );
  }

  return (
    <div>
      <p>test</p>



      <Button variant="contained" onClick={startConnection}>Connect</Button>
      <Button variant="outlined" onClick={stopConnection}>Disconnect</Button>


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Array.from(Array(60)).map((_, index) => (
          <Grid item xs={4} sm={4} md={1} key={index}>
            <H264Player frameObservable={observable} size={100} />
          </Grid>
        ))}
      </Grid>



    </div>
  )
}
