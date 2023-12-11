
import React, { useEffect } from 'react';
import { EventListProps, ArtsentryEvent } from './types';



const EventList: React.FC<EventListProps> = ({ eventClick, eventProcessor }) => {
    const [eventList, setEventList] = React.useState<ArtsentryEvent[]>([]);

    useEffect(() => {
        const subscription = eventProcessor.stream((event) => {
            console.log("Event processor recieved event " + JSON.stringify(event));
            const uiEvent : ArtsentryEvent = { type: event.eventType!, recId: event.recId! };
            setEventList((prevList) => [...prevList, uiEvent]);
        });
    }, []);
  return (
    <ul>
      {eventList.map((event, index) => (
        <li key={index} onClick={(d) => eventClick(event)}>{event.recId}</li>
      ))}
    </ul>
  );
};

export default EventList;
