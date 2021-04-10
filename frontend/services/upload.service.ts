import { fetchWrapperWithAuth, fetchWrapper } from '../helpers';
import { File } from './types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}/room`;

export const uploadService = {
  getAll,
  sendFile
};

function getAll(roomId: number) {
  return fetchWrapperWithAuth.get<File[]>(`${baseUrl}/${roomId}/uploads`);
}

function sendFile(roomId: string, formData: FormData): Promise<File> {
  const url = `${baseUrl}/${roomId}/uploads`;
  return fetchWrapper.handleResponse(
    fetch(url, {
      method: 'POST',
      headers: fetchWrapper.authHeader(url),
      body: formData
    })
  );
}
