
import React from 'react';
import { EventListProps, ArtsentryEvent } from './types';



const EventList: React.FC<EventListProps> = ({ events, eventClick }) => {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index} onClick={(d) => eventClick(event)}>{event.recId}</li>
      ))}
    </ul>
  );
};

export default EventList;
