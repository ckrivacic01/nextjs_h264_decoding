import { VcsServerContext } from '@acuity-vct/vcs-client-api/dist'
import { Observable, Subject } from "rxjs"
import { VideoMessage } from "@/generated/videomessage"
import { WebSocketSubject, webSocket } from "rxjs/webSocket"
import { WebSocketMessage } from "rxjs/internal/observable/dom/WebSocketSubject"


export class PushClient{
    url: string
    messageSubject: Subject<MessageEvent>
    constructor(context: VcsServerContext){
        this.url = `ws://${context.host}/api/v1/video?access_token=${context.userSession.token}`;

        this.messageSubject = webSocket({
            url: this.url,
            deserializer: (e) => e
        })
    }


}