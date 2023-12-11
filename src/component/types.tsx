import { EventProcessor } from "@acuity-vct/vcs-client-api/dist";

export interface EventListProps {
    eventClick: (event: ArtsentryEvent) => void;
    eventProcessor: EventProcessor;
}
  
export interface ArtsentryEvent{
      type: string;
      recId: string;
}

export interface HLSPlayerProps{
    src: string;
}