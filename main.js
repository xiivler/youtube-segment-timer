 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 var player1;
 var player2;

 function onYouTubeIframeAPIReady() {
   player1 = new YT.Player('player1', {events: {'onStateChange': onPlayerStateChange}});
   player2 = new YT.Player('player2', {events: {'onStateChange': onPlayerStateChange}});
 }

 var currentStartTime = 0;
 var currentEndTime = 0;

 var monitor = setInterval(update, 100);

 function update() {
  if (adjust(false))
  	calculate();
 }
 
 function adjust(justPaused) {
 	let adjustment = false;
   if (player1.getPlayerState() == YT.PlayerState.PAUSED && currentStartTime != player1.getCurrentTime()) {
     let diffFrames = Math.abs(player1.getCurrentTime() - currentStartTime) * 60;
     if (!justPaused && (Math.abs(diffFrames - 1) < 0.001 || Math.abs(diffFrames - 2) < 0.002))
       currentStartTime = player1.getCurrentTime();
     else {
       let adjustedTime = Math.ceil(player1.getCurrentTime() * 30) / 30 - 0.007;
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
   }
   else if (player2.getPlayerState() == YT.PlayerState.PAUSED && currentEndTime != player2.getCurrentTime()) {
     let diffFrames = Math.abs(player2.getCurrentTime() - currentEndTime) * 60;
     if (!justPaused && (Math.abs(diffFrames - 1) < 0.001 || Math.abs(diffFrames - 2) < 0.002))
       currentEndTime = player2.getCurrentTime();
     else {
       let adjustedTime = Math.ceil(player2.getCurrentTime() * 30) / 30 - 0.007;
       player2.seekTo(adjustedTime, true);
       currentEndTime = adjustedTime;
     }
     adjustment = true;
   }
   
   return adjustment;
 }

 function calculate() {
  
  if (currentStartTime < 0)
  	currentStartTime = 0;
  if (currentEndTime < 0)
  	currentEndTime = 0;
  
  let startSeconds = Math.floor(currentStartTime);
  let startFrames = Math.ceil((currentStartTime - startSeconds) * 60);
  
  let endSeconds = Math.floor(currentEndTime);
  let endFrames = Math.ceil((currentEndTime - endSeconds) * 60);
  
  let seconds = endSeconds - startSeconds;
  let frames = endFrames - startFrames;
  
  if (frames < 0) {
  	frames += 60;
    seconds--;
  }
  
  let startFrameTime = String(startSeconds).padStart(2, '0') + ':' + String(startFrames).padStart(2, '0');
  document.getElementById('startFrameTime').value = startFrameTime;
  
  let endFrameTime = String(endSeconds).padStart(2, '0') + ':' + String(endFrames).padStart(2, '0');
  document.getElementById('endFrameTime').value = endFrameTime;

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
 
 function onPlayerStateChange(event) {
 	if (adjust(true))
  	calculate();
 }
