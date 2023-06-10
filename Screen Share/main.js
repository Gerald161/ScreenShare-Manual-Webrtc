
var UserVideo = document.querySelector('#localVideo')

var partnerVideo = document.querySelector('#remoteVideo')

var textarea = document.querySelector("textarea")

var pc = new RTCPeerConnection({
  configuration : {
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  },
  iceServers: [
    {
        urls: "stun:numb.viagenie.ca",
        username: "sultan1640@gmail.com",
        credential: "98376683"
    },
    {
        urls: "turn:numb.viagenie.ca",
        username: "sultan1640@gmail.com",
        credential: "98376683"
    }
]
})

pc.onicecandidate = (e) => {
  if(e.candidate){
    console.log(JSON.stringify(e.candidate))
  }
}

pc.oniceconnectionstatechange = (e) => {
}

pc.ontrack = (e) => {
  partnerVideo.srcObject = e.streams[0] 
}
   
// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: false
// }).then(success).catch(() => {
//   console.log('errors with the media device')
// })

var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

async function getMediaDisplay(){
  var stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

  UserVideo.srcObject = stream
  
  pc.addStream(UserVideo.srcObject)
}

getMediaDisplay().catch(()=>{
  console.log('errors with the media device')
})

// navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(success).catch(() => {
//   console.log('errors with the media device')
// })

function createOffer(){
  pc.createOffer({
    mandatory: {
      offerToReceiveAudio: false,
      offerToReceiveVideo: true
    },
  })
  .then(sdp => {
    console.log(JSON.stringify(sdp))
    pc.setLocalDescription(sdp)
  }, e => {})
}

function setRemoteDescription(){
  const desc = JSON.parse(textarea.value)

  pc.setRemoteDescription(new RTCSessionDescription(desc))
}

function createAnswer(){
  pc.createAnswer({
    mandatory: {
      offerToReceiveAudio: false,
      offerToReceiveVideo: true
    }
  })
  .then(sdp => {
    console.log(JSON.stringify(sdp))
    pc.setLocalDescription(sdp)
  }, e => {})
}


function addCandidate(){
  const candidate = JSON.parse(textarea.value)

  pc.addIceCandidate(new RTCIceCandidate(candidate))
}