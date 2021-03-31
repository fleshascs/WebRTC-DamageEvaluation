import { fetchWrapperWithAuth } from "../helpers";
import getConfig from "next/config";
import { Participant } from "./types";

const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}/room`;

export const participantService = {
  getAll,
  add,
};

function add(roomId: number, participantIds: number[]) {
  return fetchWrapperWithAuth.post(`${baseUrl}/${roomId}/participants`, {
    participantIds,
  });
}

function getAll(roomId: number) {
  return fetchWrapperWithAuth.get<Participant[]>(
    `${baseUrl}/${roomId}/participants`
  );
}
