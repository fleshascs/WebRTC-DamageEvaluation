import { BehaviorSubject } from "rxjs";
import Router from "next/router";
import { fetchWrapperWithAuth } from "../helpers";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const roomSubject = new BehaviorSubject(null);
const isLoadingSubject = new BehaviorSubject(false);
const failedSubject = new BehaviorSubject(false);
const baseUrl = `${publicRuntimeConfig.apiUrl}/room`;

export const roomService = {
  getById,
  create,
  isLoading: isLoadingSubject.asObservable(),
  failed: failedSubject.asObservable(),
  room: roomSubject.asObservable(),
  get roomValue() {
    return roomSubject.value;
  },
};

async function getById(id: number) {
  try {
    isLoadingSubject.next(true);
    failedSubject.next(false);
    const room = await fetchWrapperWithAuth.get(`${baseUrl}/${id}`);
    roomSubject.next(room);
    isLoadingSubject.next(false);
    failedSubject.next(false);
    return room;
  } catch (error) {
    roomSubject.next(null);
    isLoadingSubject.next(false);
    failedSubject.next(true);
  }
}

function create(params) {
  return fetchWrapperWithAuth.post(baseUrl, params);
}
