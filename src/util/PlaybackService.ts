import { ArtsentryEvent } from "@/component/types";
import { VcsRest, VcsServerContext, VcsApiError, toVcsError } from "@acuity-vct/vcs-client-api/dist";
import { ServerContext } from "react";
//TODO: move the the type script vcs library
export class PlayBackService extends VcsRest{
    topicUrl : string;
   
    constructor(serverContext: VcsServerContext){
        super(serverContext);

        this.topicUrl = this.serverContext.topicUrl("playback")
    }

    /*
        create hls stream for event. Comletes with the url to view the stream in a video tag
    */
    reviewEvent(event: ArtsentryEvent): Promise<string>{
        return new Promise((resolve, reject) => {
            const eventPath = `${this.url}/${event.recId}`;
            console.log(`reviewEvent at path=${eventPath}`);
            this.httpClient.get(eventPath, {headers: {Authorization: `Bearer ${this.serverContext.userSession.token}`}, withCredentials: true})
                .then(response => {
                    if (response.data["urlToPlaylist"]) {
                        console.log(`got urlPlaylistUrl=${response.data["urlToPlaylist"]}`);
                        const urlPath = response.data["urlToPlaylist"];
                        const url = `${this.serverContext.httpSchema}://${this.serverContext.host}${urlPath}`;
                        resolve(url);
                    }
                    else {
                        // TODO create proper error
                        reject(new VcsApiError("No token returned"));
                    }
                }).catch(err => reject(toVcsError(err)))
        });
    }
}