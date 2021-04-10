import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as cookiesManager from '../../helpers/cookiesManager';
import { withRoomContext } from './RoomContext';
import * as stateActions from '../../redux/stateActions';
import PeerView from './PeerView';
import styles from './room.module.css';

class Me extends React.Component {
  constructor(props) {
    super(props);

    this._rootNode = null;
  }

  render() {
    const {
      roomClient,
      connected,
      me,
      audioProducer,
      videoProducer,
      faceDetection,
      onSetStatsPeerId
    } = this.props;

    let micState;

    if (!me.canSendMic) micState = 'unsupported';
    else if (!audioProducer) micState = 'unsupported';
    else if (!audioProducer.paused) micState = 'on';
    else micState = 'off';

    let webcamState;

    if (!me.canSendWebcam) webcamState = 'unsupported';
    else if (videoProducer && videoProducer.type !== 'share') webcamState = 'on';
    else webcamState = 'off';

    let changeWebcamState;

    if (Boolean(videoProducer) && videoProducer.type !== 'share' && me.canChangeWebcam)
      changeWebcamState = 'on';
    else changeWebcamState = 'unsupported';

    let shareState;

    if (Boolean(videoProducer) && videoProducer.type === 'share') shareState = 'on';
    else shareState = 'off';

    const videoVisible = Boolean(videoProducer) && !videoProducer.paused;

    let tip;

    if (!me.displayNameSet) tip = 'Click on your name to change it';

    return (
      <div
        data-component='Me'
        ref={(node) => (this._rootNode = node)}
        data-tip={tip}
        data-tip-disable={!tip}
        className={styles.myVideoContainer}
      >
        {connected ? (
          <div className='controls'>
            <div
              className={classnames('button', 'mic', micState)}
              onClick={() => {
                micState === 'on' ? roomClient.muteMic() : roomClient.unmuteMic();
              }}
            />

            <div
              className={classnames('button', 'webcam', webcamState, {
                disabled: me.webcamInProgress || me.shareInProgress
              })}
              onClick={() => {
                if (webcamState === 'on') {
                  cookiesManager.setDevices({ webcamEnabled: false });
                  roomClient.disableWebcam();
                } else {
                  cookiesManager.setDevices({ webcamEnabled: true });
                  roomClient.enableWebcam();
                }
              }}
            />

            <div
              className={classnames('button', 'change-webcam', changeWebcamState, {
                disabled: me.webcamInProgress || me.shareInProgress
              })}
              onClick={() => roomClient.changeWebcam()}
            />

            <div
              className={classnames('button', 'share', shareState, {
                disabled: me.shareInProgress || me.webcamInProgress
              })}
              onClick={() => {
                if (shareState === 'on') roomClient.disableShare();
                else roomClient.enableShare();
              }}
            />
          </div>
        ) : null}

        {audioProducer ? (
          <PeerView
            isMe
            peer={me}
            audioProducerId={audioProducer ? audioProducer.id : null}
            videoProducerId={videoProducer ? videoProducer.id : null}
            audioRtpParameters={audioProducer ? audioProducer.rtpParameters : null}
            videoRtpParameters={videoProducer ? videoProducer.rtpParameters : null}
            audioTrack={audioProducer ? audioProducer.track : null}
            videoTrack={videoProducer ? videoProducer.track : null}
            videoVisible={videoVisible}
            audioCodec={audioProducer ? audioProducer.codec : null}
            videoCodec={videoProducer ? videoProducer.codec : null}
            audioScore={audioProducer ? audioProducer.score : null}
            videoScore={videoProducer ? videoProducer.score : null}
            faceDetection={faceDetection}
            onChangeDisplayName={(displayName) => {
              roomClient.changeDisplayName(displayName);
            }}
            onChangeMaxSendingSpatialLayer={(spatialLayer) => {
              roomClient.setMaxSendingSpatialLayer(spatialLayer);
            }}
            onStatsClick={onSetStatsPeerId}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const producersArray = Object.values(state.producers);
  const audioProducer = producersArray.find((producer) => producer.track.kind === 'audio');
  const videoProducer = producersArray.find((producer) => producer.track.kind === 'video');

  return {
    connected: state.room.state === 'connected',
    me: state.me,
    audioProducer: audioProducer,
    videoProducer: videoProducer,
    faceDetection: state.room.faceDetection
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetStatsPeerId: (peerId) => dispatch(stateActions.setRoomStatsPeerId(peerId))
  };
};

const MeContainer = withRoomContext(connect(mapStateToProps, mapDispatchToProps)(Me));

export default MeContainer;
