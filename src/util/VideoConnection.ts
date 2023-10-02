
import { VideoMessage } from "@/generated/videomessage";

class VideoConnection{
    url: string;
    socket: WebSocket
    token: string
    constructor(){
        this.token = 'eyJraWQiOiJWQ1MiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJWQ1MiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNzc5NjA3OSwiaWF0IjoxNjk2MjYwMDc5fQ.PRXffNJT8IX4WtiR7glql6pte4v5MW3DjLwAZG4tidpy8nzGAjYC8V1C1Kq4nFjYvVZWU6JlSO6fdnf5jOvFEg'
        this.url = `ws://localhost:80/api/v1/video?access_token=${this.token}`
        this.socket = new WebSocket(this.url);

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
                console.log(`got video message iframe=${videomessage.iframe} camera=${videomessage.cameraNumber} nalUnitSize=${videomessage.nalUnit.length}`);
            });
            
        }
    });

    this.socket.addEventListener("error", (event) => {
        console.log("Error from server ", event);
    });
    }
}   

export default VideoConnection;