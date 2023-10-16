
import { H264VideoMessage, VideoMessage } from "@/generated/videomessage";
import { Subject } from "rxjs";
import { VcsServerContext } from "@acuity-vct/vcs-client-api/dist/vcs/vcs-server-context";
  import { VcsRestAuthenticate } from "@acuity-vct/vcs-client-api/dist/vcs/vcs-rest-authenticate";

type VideoSubscriptionSpec = {
    videoStreamKey: VideoStreamKey,
    codec: string
}

type VideoStreamKey = {
    cameraNumber: number,
    scaled: boolean
}

type Subscription = {
    category: string,
    spec: VideoSubscriptionSpec
}

class VideoConnection{
    private socket?: WebSocket
    frameSubject: Subject<H264VideoMessage>
    host: string = "192.168.2.44"
    port: number = 80
    context: VcsServerContext = new VcsServerContext();
    scheme = {
        websocket: "ws",
        http: "http"
    }
    constructor(){
        this.context.host = `${this.host}:${this.port}`
        this.login()
        .then(() => this.connectToVideoApi());
        
        // this.token = 'eyJraWQiOiJWQ1MiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJWQ1MiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyODE1OTg1MSwiaWF0IjoxNjk2NjIzODUxfQ.72EmTSzFZC_iesrXZSvyHarzExhoVik-TpTszwst_xBfMrB-32iIgYPqSVHa3qMcXOsEwit2_Cp9QtzTo6NQiQ'
        // this.url = `ws://localhost:80/api/v1/video?access_token=${this.token}`
        // this.socket = new WebSocket(this.url);
        this.frameSubject = new Subject<H264VideoMessage>();

        // Connection opened
    
    }

    close(){
        this.socket?.close();
    }

    subscribeToCamera(sessionId: string, jwt: string){
        var videoSubscription: Subscription = {
            category: "video",
            spec: {
                videoStreamKey: {
                    cameraNumber: 2,
                    scaled: true
                },
                codec: "h264"
            }
        }
        this.startSubscription(videoSubscription, sessionId, jwt);
    }

    async startSubscription(videoSubscription: Subscription, sessionId: string, jwt: string){
        var response = await fetch(`${this.scheme.http}://${this.host}:${this.port}/api/v1/video/${sessionId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.getToken()}`
            },
            body: JSON.stringify([videoSubscription])
        })
        console.log("start subscription response", response);
    }

    getToken() : string{
        return this.context.userSession.token ?? "";
        // return fetch(`${this.scheme.http}://${this.host}:${this.port}/api/v1/authenticate`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         username: "admin",
        //         password: "system"
        //     })
        // }).then((response) => response.json())
        // .then((json) => json.jwt)
        // return "eyJraWQiOiJWQ1MiLCJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJWQ1MiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTcyODE1OTg1MSwiaWF0IjoxNjk2NjIzODUxfQ.72EmTSzFZC_iesrXZSvyHarzExhoVik-TpTszwst_xBfMrB-32iIgYPqSVHa3qMcXOsEwit2_Cp9QtzTo6NQiQ";
        
    }

    async login(){
        var authenticate = new VcsRestAuthenticate(this.context);
        var jwt = await authenticate.login("admin", "system")
        console.log("jwt", this.context.userSession.token);
    }

    connectToVideoApi(){
        const token = this.getToken();
       
            //TODO: does not work with https as fetch api does not support self signed certs.
            const url = `${this.scheme.websocket}://${this.host}:${this.port}/api/v1/video?access_token=${token}`
            this.socket = new WebSocket(url);
            this.socket.addEventListener("open", (event) => {
                this.socket?.send("Hello Server!");
            });
        
        
            // Listen for messages
            this.socket.addEventListener("message", (event) => {
                // console.log("Message from server ", event.data);
                if(event.data instanceof Blob){
                    console.log("got a binary message");
                    const dataBuffer : Promise<void | ArrayBuffer> = event.data.arrayBuffer()
                    .then((buffer) => {
                        return new Uint8Array(buffer);
                    })
                    .then((uint8Array) => {
                        const videomessage = VideoMessage.fromBinary(uint8Array);
                        const h264VideoMessage = videomessage.frame;
                        if(h264VideoMessage.oneofKind == "h264VideoMessage"){
                            const message = h264VideoMessage.h264VideoMessage;
                            console.log(`got video message iframe=${message.iframe} camera=${videomessage.videoStreamKey?.cameraNumber} nalUnitSize=${message.nalUnit.length} isParameterSet=${message.isParameterSet}`);
                            this.frameSubject.next(message);
                        }
                        
                    });
                    
                }else{
                    console.log(`got a text message=${event.data}`);
                    var obj = JSON.parse(event.data);
                    if(obj.sessionId){
                        console.log(`got a session id=${obj.sessionId}`);
                        this.subscribeToCamera(obj.sessionId, token);
                    }


                }
            });
        
            this.socket.addEventListener("error", (event) => {
                console.log("Error from server ", event);
            }); 
    }
}   

export default VideoConnection;