import { BehaviorSubject } from "rxjs";
import { fetchWrapperWithAuth } from "../helpers";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const roomsSubject = new BehaviorSubject(null);
const isLoadingSubject = new BehaviorSubject(false);
const failedSubject = new BehaviorSubject(false);
const baseUrl = `${publicRuntimeConfig.apiUrl}/room`;

export const roomsService = {
  getAll,
  isLoading: isLoadingSubject.asObservable(),
  failed: failedSubject.asObservable(),
  rooms: roomsSubject.asObservable(),
  get roomsValue() {
    return roomsSubject.value;
  },
};

async function getAll() {
  try {
    isLoadingSubject.next(true);
    failedSubject.next(false);
    const rooms = await fetchWrapperWithAuth.get(`${baseUrl}`);
    roomsSubject.next(rooms);
    isLoadingSubject.next(false);
    failedSubject.next(false);
    return rooms;
  } catch (error) {
    roomsSubject.next(null);
    isLoadingSubject.next(false);
    failedSubject.next(true);
  }
}
