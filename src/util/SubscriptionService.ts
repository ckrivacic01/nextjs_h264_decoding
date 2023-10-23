import { VcsRest } from '@acuity-vct/vcs-client-api/dist';
import { Subscription } from "./VideoConnection";
import { VcsServerContext } from '@acuity-vct/vcs-client-api/dist';
//TODO: move to the client api module when ready
export class SubscriptionService extends VcsRest{
    topicUrl: string;

    constructor(serverContext: VcsServerContext){
        super(serverContext);
        this.topicUrl = serverContext.topicUrl("video")
    }

    async startSubscription(videoSubscription: Subscription, sessionId: string, jwt: string) : Promise<void>{
        return new Promise((resolve, reject) => {
            //post takes an array of subscriptions
            this.httpClient.post(`${this.url}/${sessionId}`, [videoSubscription], {
                headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
            })
            .then((response) => {
                if(response.status == 200){
                    resolve()
                }else{
                    reject("failed to start subscription");
                }
            });
        });
    }
}