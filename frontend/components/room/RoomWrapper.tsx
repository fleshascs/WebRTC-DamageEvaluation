import { useEffect, useRef, useState, useCallback, useMemo, ReactNode } from 'react';
import RoomContext from './RoomContext';
import * as stateActions from '../../redux/stateActions';
import deviceInfo from '../../helpers/deviceInfo';
import RoomClient from './RoomClient';
import { useDispatch, useSelector } from 'react-redux';
import randomString from 'random-string';
import UrlParse from 'url-parse';
import { getStore } from '../../redux/store';
import { roomService } from '../../services';

interface RoomWrapperProps {
  children: ReactNode;
  roomId: string;
}

export const RoomWrapper: React.FC<RoomWrapperProps> = (props) => {
  const { children, roomId } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);
  const dispatch = useDispatch();
  const [roomClient, setRoomClient] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    let currentRoomClient = roomService.getRoomClient();

    const urlParser = new UrlParse(window.location.href, true);
    const peerId = randomString({ length: 8 }).toLowerCase();
    let displayName = 'testName';
    const handler = urlParser.query.handler;
    const useSimulcast = urlParser.query.simulcast !== 'false';
    const useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
    const forceTcp = urlParser.query.forceTcp === 'true';
    const produce = urlParser.query.produce !== 'false';
    const consume = urlParser.query.consume !== 'false';
    const forceH264 = urlParser.query.forceH264 === 'true';
    const forceVP9 = urlParser.query.forceVP9 === 'true';
    const svc = urlParser.query.svc;
    const datachannel = urlParser.query.datachannel !== 'false';
    const info = urlParser.query.info === 'true';
    const faceDetection = urlParser.query.faceDetection === 'true';
    const externalVideo = urlParser.query.externalVideo === 'true';
    const throttleSecret = urlParser.query.throttleSecret;
    const e2eKey = urlParser.query.e2eKey;

    // Get the effective/shareable Room URL.
    const roomUrlParser = new UrlParse(window.location.href, true);
    const roomUrl = roomUrlParser.toString();

    let displayNameSet = true;

    // Get current device info.
    const device = deviceInfo();
    dispatch(stateActions.setRoomUrl(roomUrl));
    dispatch(stateActions.setRoomFaceDetection(faceDetection));
    dispatch(stateActions.setMe({ peerId, displayName, displayNameSet, device }));
    if (currentRoomClient && currentRoomClient.roomId !== roomId) {
      currentRoomClient.close();
    }
    if (!currentRoomClient || currentRoomClient?.isClosed()) {
      RoomClient.init({ store: getStore() });
      currentRoomClient = new RoomClient({
        roomId,
        peerId,
        displayName,
        device,
        handlerName: handler,
        useSimulcast,
        useSharingSimulcast,
        forceTcp,
        produce,
        consume,
        forceH264,
        forceVP9,
        svc,
        datachannel,
        externalVideo,
        e2eKey
      });
      roomService.setRoomClient(currentRoomClient);
      currentRoomClient.join();
    }

    setRoomClient(currentRoomClient);

    return () => {
      const roomClient = roomService.getRoomClient();
      roomClient.close();
    };
  }, [roomId]);

  if (!show) return null;

  return <RoomContext.Provider value={roomClient}>{children}</RoomContext.Provider>;
};
