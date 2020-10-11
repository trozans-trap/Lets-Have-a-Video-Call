const socket = io('/');
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true;

let myVideoStram;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    myVideoStram = stream;
    addVideoStream(myVideo, stream);
})

socket.emit('join-room', roomId);

socket.on('user-connected',()=>{
    connecToNewUser();
})

const connecToNewUser = ()=>{
    
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}