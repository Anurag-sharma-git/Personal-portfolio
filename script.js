console.log("Lets write javascript");
let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])

        }

    }
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {


     songs = await getsongs()
    playMusic(songs[0], true)


    // playing first song
    var audio = new Audio(songs[4]);
    // audio.play();

    // show all songs in the
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width = "34"src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}  </div>
                                <div> Anurag</div>
                            </div>
                            <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="play.svg" alt="">
                        </div></li>`;


    }

    // add an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    // add an eventlistener to playbar
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }

    })


    // time update
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)* percent)
    })

    
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

}
main()
