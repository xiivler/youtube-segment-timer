 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 var player1;
 var player2;

 function onYouTubeIframeAPIReady() {
   player1 = new YT.Player('player1');
   player2 = new YT.Player('player2');
 }

 var currentStartTime = 0;
 var currentEndTime = 0;

 var monitor = setInterval(update, 100);

 function update() {
  if (adjust())
  	calculate();
 }
 
 function adjust() {
 	let adjustment = false;
   if (player1.getPlayerState() == YT.PlayerState.PAUSED && currentStartTime != player1.getCurrentTime()) {
     if (Math.abs(player1.getCurrentTime() - currentStartTime) * 60 - 1 < 0.0001)
       currentStartTime = player1.getCurrentTime();
     else {
       let adjustedTime = Math.round(player1.getCurrentTime() * 30) / 30;
       player1.seekTo(adjustedTime, true);
       currentStartTime = adjustedTime;
     }
     adjustment = true;
   }
   
   if (player2.getCurrentTime() < currentStartTime) {
     player2.seekTo(currentStartTime, true);
     if (player2.getPlayerState() == YT.PlayerState.CUED)
       player2.pauseVideo();
     currentEndTime = currentStartTime;
     adjustment = true;
   }
   else if (player2.getPlayerState() == YT.PlayerState.PAUSED && currentEndTime != player2.getCurrentTime()) {
     if (Math.abs(player2.getCurrentTime() - currentEndTime) * 60 - 1 < 0.0001)
       currentEndTime = player2.getCurrentTime();
     else {
       let adjustedTime = Math.round(player2.getCurrentTime() * 30) / 30;
       player2.seekTo(adjustedTime, true);
       currentEndTime = adjustedTime;
     }
     adjustment = true;
   }
   
   return adjustment;
 }

 function calculate() {
  let time = player2.getCurrentTime() - player1.getCurrentTime();
  
  let seconds = Math.floor(time);
  let frames = Math.round((time - seconds) * 60);

  let frameTime = String(seconds).padStart(2, '0') + ':' + String(frames).padStart(2, '0');
  document.getElementById('frameTime').value = frameTime;
  
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  let milliseconds = Math.round(frames / 60 * 1000);
  
  let msTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + '.' + String(milliseconds).padStart(3, '0');
  document.getElementById('msTime').value = msTime;
  
 }
 var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
 var regExpTime = /(?<=\?t=|\&t=)([^&\n?#]+)/;
 
 function loadVideo() {
   let url = document.getElementById('youtubeId').value;
   let match = url.match(regExp);
   if (match && match[2].length == 11) {
     let start = 0;
  	 let timeData = url.match(regExpTime);
   	 if (timeData)
     	 start = timeData[0];
     player1.cueVideoById(match[2], start);
     player2.cueVideoById(match[2], start);
   }
 }
 
 function onStateChangePlayer1(event) {
 	if (event.data == YT.PlayerState.CUED) {
 		player1.playVideo();
  	player1.pauseVideo();
  }
 }
