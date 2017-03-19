import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import $ from 'jquery';

class VideoChat extends Component {
  componentDidMount() {
    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      autoRequestMedia: true,

      debug: true
    });

    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom('your awesome room name');
    });

    // local screen obtained
    webrtc.on('localScreenAdded', function (video) {
        video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        document.getElementById('localScreenContainer').appendChild(video);
        $('#localScreenContainer').show();
    });
    // local screen removed
    webrtc.on('localScreenRemoved', function (video) {
        document.getElementById('localScreenContainer').removeChild(video);
        $('#localScreenContainer').hide();
    });

    webrtc.on('videoAdded', function (video, peer) {
      console.log('video added', peer);
      var remotes = document.getElementById('remotes');
      if (remotes) {
          var container = document.createElement('div');
          container.className = 'videoContainer';
          container.id = 'container_' + webrtc.getDomId(peer);
          container.appendChild(video);

          // suppress contextmenu
          video.oncontextmenu = function () { return false; };

          remotes.appendChild(container);
      }
    });
  }

  render() {
    return (
      <div>
        <div className="videoContainer">
            <video id="localVideo" height="150" onContextMenu={() => {return false;}}></video>
            <meter id="localVolume" className="volume" min="-45" max="-20" high="-25" low="-40"></meter>
        </div>
        <div id="localScreenContainer" className="videoContainer">
        </div>
        <div id="remotes"></div>
      </div>
    );
  }
}

export default VideoChat;