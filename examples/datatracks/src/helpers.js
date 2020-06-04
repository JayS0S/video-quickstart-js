'use strict';

var Video = require('twilio-video');

// publish
async function connectToRoomWithDataTrack (token) {
  const localDataTrack = new Video.LocalDataTrack();

  const room = await Video.connect(token, {
    tracks: [localDataTrack]
  });

  return room;
}

// subscribe
function subscribeDataTrack (room, dataDiv) {
  room.participants.forEach(function(participant) {
    participant.tracks.forEach(function(publication) {
      publication.on('subscribed', function(track) {
        if (track.kind === 'data') {
          track.on('message', data => {
            // APPEND MESSAGE TO THE DOM
            console.log('message received', data);
          });
          // dataDiv.appendChild(track.attach());
        }
      });
    });
  });
}

// send
function dataTrackPromise (room) {
  const dataTrackPublished = {};

  const dataTrack = new Promise(function (resolve, reject){
    room.localParticipant.on('trackPublished', function(publication) {
      if (publication.track === dataTrack) {
        resolve(dataTrack);
      }
    });

    room.localParticipant.on('trackPublicationFailed', function(error, track) {
      if (track === dataTrack) {
        reject(error);
      }
    });
  });

  return dataTrackPublished;
}

function sendData(dataTrackPublished, message) {
  dataTrackPublished.promise.then(function(){
    dataTrack.send(message)
  });
}

// receive
function receiveData (participant) {
  participant.on('trackSubscribed', function(track) {
    if (track.kind === 'data') {
      track.on('message', function(data) {
        console.log('data received', data);
      });
    }
  });
}


exports.connectToRoomWithDataTrack = connectToRoomWithDataTrack;
exports.subscribeDataTrack = subscribeDataTrack;
exports.sendData = sendData;
exports.receiveData = receiveData;
exports.dataTrackPromise = dataTrackPromise;