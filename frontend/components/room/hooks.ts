import { useEffect, useState, useContext } from 'react';
import { roomService } from '../../services';
import { roomsService } from '../../services';
import { Room } from '../../services/types';

export const useRoom = (roomId: number): [Room, boolean, boolean] => {
  const [room, setRoom] = useState<Room>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    if (!roomId) return;
    const subscriptionRoom = roomService.room.subscribe((room) => setRoom(room));
    const subscriptionLoading = roomService.isLoading.subscribe((isLoading) =>
      setIsLoading(isLoading)
    );
    const subscriptionFailed = roomService.failed.subscribe((failed) => setFailed(failed));
    if (roomId !== roomService.roomValue?.id) {
      console.log('fetching', roomId, '!==', roomService.roomValue?.id);

      roomService.getById(roomId);
    }

    return () => {
      subscriptionRoom?.unsubscribe();
      subscriptionLoading?.unsubscribe();
      subscriptionFailed?.unsubscribe();
    };
  }, [roomId]);

  return [room, isLoading, failed];
};

export const useRooms = (): [Room[], boolean, boolean] => {
  const [rooms, setRoom] = useState<Room[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    const subscriptionRoom = roomsService.rooms.subscribe((room) => setRoom(room));
    const subscriptionLoading = roomsService.isLoading.subscribe((isLoading) =>
      setIsLoading(isLoading)
    );
    const subscriptionFailed = roomsService.failed.subscribe((failed) => setFailed(failed));

    roomsService.getAll();

    return () => {
      subscriptionRoom?.unsubscribe();
      subscriptionLoading?.unsubscribe();
      subscriptionFailed?.unsubscribe();
    };
  }, []);

  return [rooms, isLoading, failed];
};
