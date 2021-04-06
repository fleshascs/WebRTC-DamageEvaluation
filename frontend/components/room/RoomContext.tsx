import React from 'react';
import type RoomClient from './RoomClient';

const RoomContext = React.createContext<RoomClient>(null);

export default RoomContext;

export function withRoomContext(Component) {
  return (
    props // eslint-disable-line react/display-name
  ) => (
    <RoomContext.Consumer>
      {(roomClient) => <Component {...props} roomClient={roomClient} />}
    </RoomContext.Consumer>
  );
}
