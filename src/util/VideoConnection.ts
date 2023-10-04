
import { VideoMessage } from "@/generated/videomessage";
import { Subject } from "rxjs";

class VideoConnection{
    url: string;
    socket: WebSocket
    token: string
    frameSubject: Subject<VideoMessage>
    constructor(){
        this.token = 'eyJraWQiOiJWQ1MiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJWQ1MiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNzk2NDQ5NSwiaWF0IjoxNjk2NDI4NDk1fQ.tbfHKXAwdiiq4VPebrznaL5FEFXl5X44d9nXmk88Lf-wx0XT-EJqVl0Qxz3bDyLfXAiW5IC7i0DxAueIKFkxSQ'
        this.url = `ws://localhost:80/api/v1/video?access_token=${this.token}`
        this.socket = new WebSocket(this.url);
        this.frameSubject = new Subject<VideoMessage>();

        // Connection opened
    this.socket.addEventListener("open", (event) => {
        this.socket.send("Hello Server!");
    });

    // Listen for messages
    this.socket.addEventListener("message", (event) => {
        // console.log("Message from server ", event.data);
        if(event.data instanceof Blob){
            console.log("got a binary message");
            const dataBuffer = event.data.arrayBuffer()
            .then((buffer) => {
                return new Uint8Array(buffer);
            })
            .then((uint8Array) => {
                const videomessage = VideoMessage.fromBinary(uint8Array);
                console.log(`got video message iframe=${videomessage.iframe} camera=${videomessage.cameraNumber} nalUnitSize=${videomessage.nalUnit.length} isParameterSet=${videomessage.isParameterSet}`);
                this.frameSubject.next(videomessage);
            });
            
        }
    });

    this.socket.addEventListener("error", (event) => {
        console.log("Error from server ", event);
    });
    }

    close(){
        this.socket.close();
    }
}   

export default VideoConnection;