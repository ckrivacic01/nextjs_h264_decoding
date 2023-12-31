import { Subject, Subscription as RxSubscription} from "rxjs";
import { VcsServerContext, VideoMessage, StreamMessageToClient } from "@acuity-vct/vcs-client-api/dist";
import { VcsRestAuthenticate } from "@acuity-vct/vcs-client-api/dist";
import { PushClient } from "./pushClient";
import { SubscriptionService } from "./SubscriptionService";

export type VideoSubscriptionSpec = {
    videoStreamKey: VideoStreamKey,
    codec: string
}

export type VideoStreamKey = {
    cameraNumber: number,
    scaled: boolean
}

export type Subscription = {
    category: string,
    spec: VideoSubscriptionSpec
}

class VideoConnection{
    private subscription?: RxSubscription
    frameSubject: Subject<VideoMessage>
    context: VcsServerContext;
    private host: string
    private port: number
    subscriptionService: SubscriptionService
    cameraNumber: number
    constructor(host: string, port: number, camera: number){
        this.host = host;
        this.port = port;
        this.cameraNumber = camera;
        this.context = new VcsServerContext({host: host, port: port, wsSchema: "wss", httpSchema: "https"})

        this.subscriptionService = new SubscriptionService(this.context);
        this.login()
        .then(() => this.connectToVideoApi());
        
        this.frameSubject = new Subject<VideoMessage>()
    
    }

    close(){
        this.subscription?.unsubscribe();
    }

    subscribeToCamera(sessionId: string, jwt: string){
        var videoSubscription: Subscription = {
            category: "video",
            spec: {
                videoStreamKey: {
                    cameraNumber: this.cameraNumber,

                    scaled: true
                },
                codec: "h264"
            }
        }
        this.subscriptionService.startSubscription(videoSubscription, sessionId, jwt);
    }

    getToken() : string{
        return this.context.userSession.token ?? "";
    }

    async login(){
        var authenticate = new VcsRestAuthenticate(this.context);
        var jwt = await authenticate.login("admin", "system")
        console.log("jwt", this.context.userSession.token);
    }

    connectToVideoApi(){
        const token = this.getToken();
       
            const connection = new PushClient(this.context);
            this.subscription = connection.messageSubject.subscribe((message) => {
                if(message.data instanceof Blob){
                    console.log("got a binary message");
                    const dataBuffer : Promise<void | ArrayBuffer> = message.data.arrayBuffer()
                    .then((buffer) => {
                        return new Uint8Array(buffer);
                    })
                    .then((uint8Array) => {
                        const message = StreamMessageToClient.fromBinary(uint8Array);
                        if(message.data.oneofKind == "videoMessage"){
                            const vm = message.data.videoMessage;
                            this.frameSubject.next(vm);

                        }

                    });
                    
                }else{
                    console.log(`got a text message=${message.data}`);
                    var obj = JSON.parse(message.data);
                    if(obj.sessionId){
                        console.log(`got a session id=${obj.sessionId}`);
                        this.subscribeToCamera(obj.sessionId, token);
                    }


                }
            });
    }
}   

export default VideoConnection;