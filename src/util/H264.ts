import { VideoMessage } from "@/generated/videomessage";
import { Subject } from "rxjs";
import { resolve } from "path";

type DecoderOptions = {
    output: (frame: VideoFrame) => void,
    error: (error: DOMException) => void
}


export default class H264Decoder {
    private options : DecoderOptions
    decoder : VideoDecoder
    private currentTime: number = 23000000;
    decodedFrame: Subject<VideoFrame> = new Subject<VideoFrame>();

    configuration: VideoDecoderConfig
    constructor(config: VideoDecoderConfig){
        this.options = {
            output: (frame) => {
                console.log("decoded frame",frame)
                //TODO: render the video frame to the screen.
                this.decodedFrame.next(frame);
            },
            error: (error) => {
                console.log("decode errro", error)
                console.log(error.message)
            }
        }
        this.decoder = new VideoDecoder(this.options);
        this.configuration = config;

        this.decoder.configure(this.configuration)
        
        console.log(this.decoder.state);
    }


    
    public sendFrame(frame: VideoMessage){
        //sps and pps only need to go to the decoder config.description when using avc stream format. Otherwise they should be included with each IDR frame.
        const encodedFrame = new EncodedVideoChunk({
            type: frame.iframe ? "key" : "delta",
            data: frame.nalUnit,
            timestamp: this.currentTime += 12000000,
            duration: 12000000
        });
        this.decoder.decode(encodedFrame)
    };
    }

