import { Component, OnInit } from '@angular/core';
declare var Hls: any;
declare var $: any;


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  playing: boolean = true;

  // video = <HTMLVideoElement>document.getElementById('video');

  constructor() { }

  ngOnInit(): void {

    var config = {
      xhrSetup: function (xhr, url) {
        xhr.withCredentials = true; // do send cookies

        xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
      }
    }

    var video = <HTMLVideoElement>document.getElementById('video');
    var videoSrc = 'https://player.vimeo.com/external/416223344.m3u8?s=628c2e26e5aff3832f0c4e8f5975b3d9f85c51ae';
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    }
    // hls.js is not supported on platforms that do not have Media Source
    // Extensions (MSE) enabled.
    // 
    // When the browser has built-in HLS support (check using `canPlayType`),
    // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
    // element through the `src` property. This is using the built-in support
    // of the plain video element, without using hls.js.
    // 
    // Note: it would be more normal to wait on the 'canplay' event below however
    // on Safari (where you are most likely to find built-in HLS support) the
    // video.src URL must be on the user-driven white-list before a 'canplay'
    // event will be emitted; the last video event that can be reliably
    // listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    }




    video.ontimeupdate = function () {
      var percentage = (video.currentTime / video.duration) * 100;
      $(".bar .fill").css("width", percentage + "%");
    };

    $(".bar").on("click", function (e) {
      var offset = $(this).offset();
      var left = (e.pageX - offset.left);
      var totalWidth = $(".bar").width();
      var percentage = (left / totalWidth);
      var vidTime = video.duration * percentage;
      video.currentTime = vidTime;
    });//click()

    /* When the openFullscreen() function is executed, open the video in fullscreen.
    Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
    $("#fullScreen").on("click", function (e) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      };
    })

    $("#pip").on("click", function (e) {
      // if (video.requestPictureInPicture) {
      //   video.requestPictureInPicture();
      // };
    })
    // videoElement.requestPictureInPicture();

    var elem = document.getElementById('videoContainer');
    var timeout;
    var duration = 3000;
    document.addEventListener('mousemove', function () {
      // elem.textContent = 'Mouse is moving!'
      $(".video-overlay").fadeIn(300);
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        $(".video-overlay").fadeOut(300);

        // elem.textContent = 'Mouse Has stopped!'
      }, duration)
    });



  }

  togglePlay() {
    var video = <HTMLVideoElement>document.getElementById('video');
    if (this.playing) {
      this.playing = false;
      video.pause();
    } else {
      this.playing = true;
      video.play();
    }
    // return this.video.paused ? this.video.play() : this.video.pause();
  };

  forward() {
    var video = <HTMLVideoElement>document.getElementById('video');
    video.currentTime += 10;
  }

  backward() {
    var video = <HTMLVideoElement>document.getElementById('video');
    video.currentTime -= 10;
  }

  // pipButtonElement.addEventListener('click', async function() {
  //   pipButtonElement.disabled = true;

  //   await videoElement.requestPictureInPicture();

  //   pipButtonElement.disabled = false;
  // });



}
