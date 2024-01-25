const APP_ID = 'e7eeff558045424890ad1e38fc511246'
const CHANNEL = 'main'
const TOKEN = '007eJxTYPhj6nym/DqDyk1n39iryzRX7T2b+CSYd7ePebZmxXfbAhkFhlTz1NS0NFNTCwMTUxMjEwtLg8QUw1Rji7RkU0NDIxOzm8s2pjYEMjIEbGZnYIRCEJ+FITcxM4+BAQAmhR6a'
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

joinAndDisplayLocalStream()