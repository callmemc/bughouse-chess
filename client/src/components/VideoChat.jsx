import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';

class VideoChat extends Component {
  componentDidMount() {
    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remotesVideos',
      // immediately ask for camera access
      autoRequestMedia: true
    });

    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom('your awesome room name');
    });
  }

  render() {
    return (
      <div>
        <video height="200" id="localVideo"></video>
        <div id="remotesVideos"></div>
      </div>
    );
  }
}

export default VideoChat;