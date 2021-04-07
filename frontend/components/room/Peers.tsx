import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './room.module.css';
import Peer from './Peer';

const Peers = ({ peers, activeSpeakerId }) => {
  return (
    <>
      {peers.map((peer) => {
        return (
          <div
            key={peer.id}
            className={classnames('peer-container', {
              [styles.activeSpeaker]: peer.id === activeSpeakerId
            })}
          >
            <Peer id={peer.id} />
          </div>
        );
      })}
    </>
  );
};

const mapStateToProps = (state) => {
  const peersArray = Object.values(state.peers);

  return {
    peers: peersArray,
    activeSpeakerId: state.room.activeSpeakerId
  };
};

const PeersContainer = connect(mapStateToProps, null, null, {
  areStatesEqual: (next, prev) => {
    return prev.peers === next.peers && prev.room.activeSpeakerId === next.room.activeSpeakerId;
  }
})(Peers);

export default PeersContainer;
