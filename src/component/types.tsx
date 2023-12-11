export interface EventListProps {
    events: ArtsentryEvent[];
    eventClick: (event: ArtsentryEvent) => void;
}
  
export interface ArtsentryEvent{
      type: string;
      recId: string;
}

export interface HLSPlayerProps{
    src: string;
}