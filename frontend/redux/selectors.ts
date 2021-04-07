export const getRoom = (state) => state.room;
export const getMe = (state) => state.me;
export const getAmActiveSpeaker = (state) => state.me.id === state.room.activeSpeakerId;
export const getAudioProducer = (state) =>
  Object.values(state.producers).find((producer) => producer.track.kind === 'audio');
export const getVideoProducer = (state) =>
  Object.values(state.producers).find((producer) => producer.track.kind === 'video');

export const getPeers = (state) => state.peers;

export const getMicAncCamEnabled = (state) => (peer) => {
  const consumersArray = peer.consumers.map((consumerId) => state.consumers[consumerId]);
  const audioConsumer = consumersArray.find((consumer) => consumer.track.kind === 'audio');
  const videoConsumer = consumersArray.find((consumer) => consumer.track.kind === 'video');
  const audioEnabled =
    Boolean(audioConsumer) && !audioConsumer.locallyPaused && !audioConsumer.remotelyPaused;
  const videoVisible =
    Boolean(videoConsumer) && !videoConsumer.locallyPaused && !videoConsumer.remotelyPaused;
  return [audioEnabled, videoVisible];
};

export const getMicState = (me, audioProducer) => {
  let micState;
  if (!me.canSendMic) micState = 'unsupported';
  else if (!audioProducer) micState = 'unsupported';
  else if (!audioProducer.paused) micState = 'on';
  else micState = 'off';
  return micState;
};

export const getWebcamState = (me, videoProducer) => {
  let webcamState;
  if (!me.canSendWebcam) webcamState = 'unsupported';
  else if (videoProducer && videoProducer.type !== 'share') webcamState = 'on';
  else webcamState = 'off';
  return webcamState;
};
