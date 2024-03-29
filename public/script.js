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
  audio: true,
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
    console.log("new user", userId, stream)
    setTimeout(() => {
      connecToNewUser(userId, stream);
    }, 2000);
  })

  let text = $('input')


  $('html').keydown((e) => {
    if (e.which == 13 && text.val().length != 0) {
      // console.log(text.val())
      socket.emit('message', text.val());
      text.val('');
    }
  })

  socket.on('createMessage', message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
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

const scrollToBottom = () => {
  let d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStram.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStram.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStram.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i>
  <span>Mute</span>`
  document.querySelector('.main_mute_button').innerHTML = html;
};
const setUnmuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>`
  document.querySelector('.main_mute_button').innerHTML = html;

};


const playStop = () => {
  console.log('object')
  let enabled = myVideoStram.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStram.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStram.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `<i class="fas fa-video"></i>
    <span>Stop Video</span>`
  document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`
  document.querySelector('.main_video_button').innerHTML = html;
}