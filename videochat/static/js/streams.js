const APP_ID = 'e7eeff558045424890ad1e38fc511246'
const CHANNEL = 'local'
const TOKEN = '007eJxTYGDW3/Kn/LfK4v4F/8tbFm7W/NIzk1ElfUrNFbfHUx4eWVKjwJBqnpqalmZqamFgYmpiZGJhaZCYYphqbJGWbGpoaGRidufPptSGQEYGwXN3WBgZIBDEZ2XIyU9OzGFgAAA1AyLd'
let UID;

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}



let joinAndDisplayLocalStream = async () =>
{
    client.on('user-published', handeUserJoined)
    client.on('user-left', handeUserLeft)
    UID = await client.join(APP_ID, CHANNEL, TOKEN, null )
    
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">Kullanıcı Adı</span></div>
                    <div id="user-${UID}" class="video-player"></div>
                </div>`
    
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
    localTracks[1].play(`user-${UID}`)
    await client.publish([localTracks[0], localTracks[1]])
}

let handeUserJoined = async (user, mediaType) =>
{
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType == 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }
        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">Kullanıcı Adı</span></div>
                    <div id="user-${user.uid}" class="video-player"></div>
                </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType = 'auido') {
        user.auidoTrack.play()
        
    }
}

let handeUserLeft = async (user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async() => {
    for (let i=0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/', '_self')
}

let toggleCamera = async (event) => {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        event.target.style.background = '#fff'
    } else{
        await localTracks[1].setMuted(true)
        event.target.style.background = 'rgba(255, 80, 80)'
    }


}
let toggleMic = async (event) => {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        event.target.style.background = '#fff'
    } else{
        await localTracks[0].setMuted(true)
        event.target.style.background = 'rgba(255, 80, 80)'
    }


}

joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)