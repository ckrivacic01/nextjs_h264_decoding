import { Observable } from "rxjs";
import { VideoMessage } from "@/generated/videomessage";
import { RefObject, useRef } from "react";
import H264Decoder from "./H264";

// worker to do the decoding on a seprate thread
// onmessage = (e) => {
//     if(e.data.observable){
//         const observable = e.data.observable;
//         const canvas = e.data.canvas
//         const decoder = new H264Decoder(e.data.config);
//         observable.subscribe((frame: VideoMessage) => {
//             decoder.sendFrame(frame);
//         });
    
//         decoder.decodedFrame.subscribe((frame: VideoFrame) => {
//             const ctx = canvas.getContext('2d');
//             ctx.drawImage(frame, 0, 0);
//         });
//     }
   
// };

const loopworker = () => {
    
    onmessage = (e) => {
        const observable = e.data.observable;
        const canvas = e.data.canvas
        const decoder = new H264Decoder(e.data.config);
        observable.subscribe((frame: VideoMessage) => {
            decoder.sendFrame(frame);
        });
    
        decoder.decodedFrame.subscribe((frame: VideoFrame) => {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(frame, 0, 0);
        });
    }
};

let code = loopworker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: 'application/javascriptssky' })
export const workerScript = URL.createObjectURL(blob)
// default export workerScript;
// module.exports = workerScript;