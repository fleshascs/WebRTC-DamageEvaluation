import React from 'react';
import classnames from 'classnames';
import Spinner from 'react-spinner';
import hark from 'hark';
import Logger from '../../helpers/Logger';
import { Video } from '../Video';
import roomStyles from '../../styles/room.module.css';
const logger = new Logger('PeerView');

export default class PeerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audioVolume: 0, // Integer from 0 to 10.,
      showInfo: false,
      videoResolutionWidth: null,
      videoResolutionHeight: null,
      videoCanPlay: false,
      videoElemPaused: false,
      maxSpatialLayer: null
    };

    // Latest received video track.
    // @type {MediaStreamTrack}
    this._audioTrack = null;

    // Latest received video track.
    // @type {MediaStreamTrack}
    this._videoTrack = null;

    // Hark instance.
    // @type {Object}
    this._hark = null;

    // Periodic timer for reading video resolution.
    this._videoResolutionPeriodicTimer = null;

    // requestAnimationFrame for face detection.
    this._faceDetectionRequestAnimationFrame = null;
  }

  render() {
    const {
      isMe,
      peer,
      audioProducerId,
      videoProducerId,
      audioConsumerId,
      videoConsumerId,
      videoRtpParameters,
      consumerSpatialLayers,
      consumerTemporalLayers,
      consumerCurrentSpatialLayer,
      consumerCurrentTemporalLayer,
      consumerPreferredSpatialLayer,
      consumerPreferredTemporalLayer,
      consumerPriority,
      audioMuted,
      videoVisible,
      videoMultiLayer,
      audioCodec,
      videoCodec,
      audioScore,
      videoScore,
      onChangeDisplayName,
      onChangeMaxSendingSpatialLayer,
      onChangeVideoPreferredLayers,
      onChangeVideoPriority,
      onRequestKeyFrame,
      onStatsClick
    } = this.props;

    const {
      audioVolume,
      showInfo,
      videoResolutionWidth,
      videoResolutionHeight,
      videoCanPlay,
      videoElemPaused,
      maxSpatialLayer
    } = this.state;

    return (
      <div data-component='PeerView' className={classnames({ [roomStyles.videoThumbnail]: !isMe })}>
        <div className='info'>
          <div className='icons'>
            <div
              className={classnames('icon', 'info', { on: showInfo })}
              onClick={() => this.setState({ showInfo: !showInfo })}
            />

            <div className={classnames('icon', 'stats')} onClick={() => onStatsClick(peer.id)} />
          </div>
        </div>

        <Video
          ref='videoElem'
          className={classnames({
            'is-me': isMe,
            hidden: !videoVisible || !videoCanPlay,
            'network-error': videoVisible && videoMultiLayer && consumerCurrentSpatialLayer === null
          })}
          autoPlay
          playsInline
          muted
          controls={false}
        />

        <audio ref='audioElem' autoPlay playsInline muted={isMe || audioMuted} controls={false} />

        {/* <canvas ref='canvas' className={classnames('face-detection', { 'is-me': isMe })} /> */}

        <div className='volume-container'>
          <div className={classnames('bar', `level${audioVolume}`)} />
        </div>

        {videoVisible && videoScore < 5 ? (
          <div className='spinner-container'>
            <Spinner />
          </div>
        ) : null}

        {videoElemPaused ? <div className='video-elem-paused' /> : null}
      </div>
    );
  }

  componentDidMount() {
    const { audioTrack, videoTrack } = this.props;

    this._setTracks(audioTrack, videoTrack);
  }

  componentWillUnmount() {
    if (this._hark) this._hark.stop();

    clearInterval(this._videoResolutionPeriodicTimer);
    cancelAnimationFrame(this._faceDetectionRequestAnimationFrame);

    const { videoElem } = this.refs;

    if (videoElem) {
      videoElem.oncanplay = null;
      videoElem.onplay = null;
      videoElem.onpause = null;
    }
  }

  componentWillUpdate() {
    const { isMe, audioTrack, videoTrack, videoRtpParameters } = this.props;
    const { maxSpatialLayer } = this.state;
    if (isMe && videoRtpParameters && maxSpatialLayer === null) {
      this.setState({
        maxSpatialLayer: videoRtpParameters.encodings.length - 1
      });
    } else if (isMe && !videoRtpParameters && maxSpatialLayer !== null) {
      this.setState({ maxSpatialLayer: null });
    }
    this._setTracks(audioTrack, videoTrack);
  }

  _setTracks(audioTrack, videoTrack) {
    const { faceDetection } = this.props;

    if (this._audioTrack === audioTrack && this._videoTrack === videoTrack) return;

    this._audioTrack = audioTrack;
    this._videoTrack = videoTrack;

    if (this._hark) this._hark.stop();

    this._stopVideoResolution();

    // if (faceDetection) this._stopFaceDetection();

    const { audioElem, videoElem } = this.refs;

    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audioElem.srcObject = stream;

      audioElem.play().catch((error) => logger.warn('audioElem.play() failed:%o', error));

      this._runHark(stream);
    } else {
      audioElem.srcObject = null;
    }

    if (videoTrack) {
      const stream = new MediaStream();

      stream.addTrack(videoTrack);
      videoElem.srcObject = stream;

      videoElem.oncanplay = () => this.setState({ videoCanPlay: true });

      videoElem.onplay = () => {
        this.setState({ videoElemPaused: false });

        audioElem.play().catch((error) => logger.warn('audioElem.play() failed:%o', error));
      };

      videoElem.onpause = () => this.setState({ videoElemPaused: true });

      videoElem.play().catch((error) => logger.warn('videoElem.play() failed:%o', error));

      this._startVideoResolution();

      // if (faceDetection) this._startFaceDetection();
    } else {
      videoElem.srcObject = null;
    }
  }

  _runHark(stream) {
    if (!stream.getAudioTracks()[0])
      throw new Error('_runHark() | given stream has no audio track');

    this._hark = hark(stream, { play: false });

    // eslint-disable-next-line no-unused-vars
    this._hark.on('volume_change', (dBs, threshold) => {
      // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
      //   Math.pow(10, dBs / 20)
      // However it does not produce a visually useful output, so let exagerate
      // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
      // minimize component renderings.
      let audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

      if (audioVolume === 1) audioVolume = 0;

      if (audioVolume !== this.state.audioVolume) this.setState({ audioVolume });
    });
  }

  _startVideoResolution() {
    this._videoResolutionPeriodicTimer = setInterval(() => {
      const { videoResolutionWidth, videoResolutionHeight } = this.state;
      const { videoElem } = this.refs;

      if (
        videoElem.videoWidth !== videoResolutionWidth ||
        videoElem.videoHeight !== videoResolutionHeight
      ) {
        this.setState({
          videoResolutionWidth: videoElem.videoWidth,
          videoResolutionHeight: videoElem.videoHeight
        });
      }
    }, 500);
  }

  _stopVideoResolution() {
    clearInterval(this._videoResolutionPeriodicTimer);

    this.setState({
      videoResolutionWidth: null,
      videoResolutionHeight: null
    });
  }
}
