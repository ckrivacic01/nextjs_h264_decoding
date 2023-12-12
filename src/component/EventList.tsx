
import React, { useEffect } from 'react';
import { EventListProps, ArtsentryEvent } from './types';
import { eventNames } from 'process';



const EventList: React.FC<EventListProps> = ({ eventClick, eventProcessor }) => {
    const [eventList, setEventList] = React.useState<ArtsentryEvent[]>([]);

    useEffect(() => {
        const subscription = eventProcessor.stream((event) => {
            console.log("Event processor recieved event " + JSON.stringify(event));
            const uiEvent : ArtsentryEvent = { type: event.eventType!, recId: event.recId!, description: event.description! };
            setEventList((prevList) => {
                //update the existing event with the new event. If it doesnt exist add it to the list of events
                const exists = prevList.some((event) => event.recId == uiEvent.recId);
                if(exists){
                    return prevList.map((event) => event.recId == uiEvent.recId ? uiEvent : event)
                }else{
                    return [...prevList, uiEvent];
                }

                
        });
        });
    }, []);
  return (

    <div style={{overflowY: 'auto', height: '100%'}}>
      {eventList.map((event, index) => (
        <EventInformation key={event.recId} event={event} eventClick={eventClick} />
      ))}
    </div>
  );
};

const EventInformation : React.FC<{event: ArtsentryEvent, eventClick: (event: ArtsentryEvent) => void}> = ({event, eventClick}) => {

    return (
        <div>
            <p>Event type: {event.type}</p>
            <p>Rec-id: {event.recId}</p>
            <p>Description: {event.description}</p>
            <button onClick={(d) => eventClick(event)}>review</button>
        </div>
    )
}

export default EventList;
