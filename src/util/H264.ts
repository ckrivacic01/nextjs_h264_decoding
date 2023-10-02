import { resolve } from "path";

var MP4Box = require('mp4box');
type DecoderOptions = {
    output: (frame: VideoFrame) => void,
    error: (error: DOMException) => void
}


export default class H264Decoder {
    private options : DecoderOptions
    decoder : VideoDecoder

    configuration: VideoDecoderConfig
    constructor(config: VideoDecoderConfig){
        this.options = {
            output: (frame) => console.log("decoded frame" + frame),
            error: (error) => console.log("decode errro")
        }
        this.decoder = new VideoDecoder(this.options);
        this.configuration = config;

        this.decoder.configure(this.configuration)

        console.log(this.decoder.state)

        var mp4box = MP4Box.createFile();
        mp4box.onReady()

    }

    readMp4File(file: string){
        fetch(file)
        .then()
    }

}