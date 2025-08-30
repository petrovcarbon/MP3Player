//CUSTOM TRAY BUTTONS ( CLOSE, MIN, MAX )
const{ipcRenderer}=require('electron')

document.getElementById('closebtn').addEventListener('click', ()=>{
   ipcRenderer.send('closeApp');
});
document.getElementById('minimizebtn').addEventListener('click', ()=>{
   ipcRenderer.send('minApp');
});

//MAIN CODE
const $ = require('jquery')

document.getElementById('button').addEventListener('click', addMusic);

let timer = null;
function addMusic()
{
    $('input').click()
}
document.getElementById('fileinput').addEventListener("change", musicSelected);
document.getElementById('prev').addEventListener('click', playPrevious);
document.getElementById('next').addEventListener('click', playNext);

let songData = { urls: [], title: [] };
let audioPlayer = $('audio').get(0)
let playing=false
let currentIndex=0

function musicSelected() {
    let files = $('input').get(0).files;
    songData = { urls: [], title: [] }; // reset data

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let objectURL = URL.createObjectURL(file);
        let audio = new Audio();

        audio.src = objectURL;
        audio.addEventListener('loadedmetadata', () => {
            let duration = audio.duration;
            let title = file.name.replace(/\.[^/.]+$/, '');

            songData.urls[i] = objectURL;
            songData.title[i] = title;
            document.getElementById('titlendur').style.visibility = "visible"; 

            let songRow = `
                <tr onclick="playSong(${i})">
                    <td>${title}</td>
                    <td>${secondsToTime(duration)}</td>
                </tr>
            `;

            $('#table-body').append(songRow);
        });
    }
}
function playSong(index) {
    audioPlayer.src = songData.urls[index]; // use blob URL instead of path
    audioPlayer.load();
    audioPlayer.play();
    playing = true;
    $('h4').text(songData.title[index]);
    updatePlayButton();
    timer = setInterval(updateTime, 1000);
}

function play()
{
  if(playing)
  {
    audioPlayer.pause()
    clearInterval(timer)
    playing=false
  }else{
    audioPlayer.play()
    playing=true
    timer=setInterval(updateTime, 1000)
  }
  updatePlayButton()
}

function playNext() {
    currentIndex++;
    if (currentIndex >= songData.urls.length) currentIndex = 0;
    playSong(currentIndex);
}

function playPrevious() {
    currentIndex--;
    if (currentIndex < 0) currentIndex = songData.urls.length - 1;
    playSong(currentIndex);
}

function clearPlaylist(){
  clearInterval(timer)
  $('#time-left').text('00:00')
  $('#total-time').text('00:00')
  $('#table-body').html('')
  audioPlayer.pause()
  audioPlayer.src = ''
  currentIndex = 0
  playing = false
  $('h4').text('')
  document.getElementById('titlendur').style.visibility = "hidden"; 

}

function updateTime()
{
  $('#time-left').text(secondsToTime(audioPlayer.currentTime))
  $('#total-time').text(secondsToTime(audioPlayer.duration))
  if(audioPlayer.currentTime>=audioPlayer.duration){
    playNext()
  }
}


function  updatePlayButton()
{
  if(playing)
  {
    document.getElementById("btnplay").src = "assets/pause.png"; 
  }
  else{
    document.getElementById("btnplay").src = "assets/play.png"; 
  }
}


function changeVolume(input)
{
  audioPlayer.volume=input.value
}

function secondsToTime(t) {
    return padZero(parseInt((t/(60)) % 60)) + ":" +
            padZero(parseInt((t) % 60));
}
function padZero(v) {
    return (v < 10) ? "0" + v : v;
}
