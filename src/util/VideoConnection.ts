
import { VideoMessage } from "@/generated/videomessage";
import { Subject } from "rxjs";

class VideoConnection{
    private socket?: WebSocket
    frameSubject: Subject<VideoMessage>
    host: string = "localhost"
    port: number = 80
    scheme = {
        websocket: "ws",
        http: "http"
    }
    constructor(){
        this.getToken()
        .then((t) => {
            //TODO: does not work with https as fetch api does not support self signed certs.
            const url = `${this.scheme.websocket}://${this.host}:${this.port}/api/v1/video?access_token=${t}`
            this.socket = new WebSocket(url);
            this.socket.addEventListener("open", (event) => {
                this.socket?.send("Hello Server!");
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
        });
        // this.token = 'eyJraWQiOiJWQ1MiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJWQ1MiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyODE1OTg1MSwiaWF0IjoxNjk2NjIzODUxfQ.72EmTSzFZC_iesrXZSvyHarzExhoVik-TpTszwst_xBfMrB-32iIgYPqSVHa3qMcXOsEwit2_Cp9QtzTo6NQiQ'
        // this.url = `ws://localhost:80/api/v1/video?access_token=${this.token}`
        // this.socket = new WebSocket(this.url);
        this.frameSubject = new Subject<VideoMessage>();

        // Connection opened
    
    }

    close(){
        this.socket?.close();
    }

    async getToken() : Promise<string>{
        return fetch(`${this.scheme.http}://${this.host}:${this.port}/api/v1/authenticate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "system"
            })
        }).then((response) => response.json())
        .then((json) => json.jwt)
        // return "eyJraWQiOiJWQ1MiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJWQ1MiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyODE1OTg1MSwiaWF0IjoxNjk2NjIzODUxfQ.72EmTSzFZC_iesrXZSvyHarzExhoVik-TpTszwst_xBfMrB-32iIgYPqSVHa3qMcXOsEwit2_Cp9QtzTo6NQiQ";
        
    }
}   

export default VideoConnection;