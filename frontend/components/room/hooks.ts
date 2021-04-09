import { useEffect, useState, useContext, useCallback } from 'react';
import { roomService, participantService } from '../../services';
import { roomsService, uploadService } from '../../services';
import { Room, Participant } from '../../services/types';
import { useRouter } from 'next/router';

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

export const useParticipants = (): Participant[] => {
  const router = useRouter();
  const roomId = parseInt(router.query.id as string);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const getParticipants = useCallback(async (roomId) => {
    const participants = await participantService.getAll(roomId);
    setParticipants(participants);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    getParticipants(roomId);
  }, [router.isReady]);

  return participants;
};

export const useUploads = (): any[] => {
  const router = useRouter();
  const roomId = parseInt(router.query.id as string);
  const [uploads, setUploads] = useState<any>([]);

  const getUploads = useCallback(async (roomId) => {
    const uploads = await uploadService.getAll(roomId);
    setUploads(uploads);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    getUploads(roomId);
  }, [router.isReady]);

  return uploads;
};
