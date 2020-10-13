const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3050'
})

let myVideoStram;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false,
}).then(stream => {
  myVideoStram = stream;
  addVideoStream(myVideo, stream);

  peer.on('call', call => {
    console.log("in peer call")
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) => {
    console.log("new user",userId,stream)
    setTimeout(() => {
      connecToNewUser(userId, stream);
    }, 2000);
  })

})


peer.on('open', id => {
  socket.emit('join-room', roomId, id);
})

const connecToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

