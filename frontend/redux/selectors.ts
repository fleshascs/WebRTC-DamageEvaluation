export const getRoom = (state) => state.room;
export const getMe = (state) => state.me;
export const getAmActiveSpeaker = (state) => state.me.id === state.room.activeSpeakerId;
