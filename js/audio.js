/**
 * Audio.js: sound engine
 */

function Audio() {
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    
    /**
     * Load a sound buffer.
     */
    this.load = function(uri, onLoadCallback) {
        
        var async   = onLoadCallback ? true : false,
            request = new XMLHttpRequest();
        
        request.open('GET', uri, async);
        request.responseType = 'arraybuffer';
        
        request.onload = function () {
            context.decodeAudioData(
                request.response, 
                function(buffer) {
                    onLoadCallback(buffer);
                },
                function(e) {
                    console.error("Error with decoding audio data" + e.err);
                }
            );
        };
        
        request.send();
        
    };
    
    this.play = function(buffer, volume, loop, playbackRate) {
        
        volume = volume || 1.0;
        volume = volume < 0 || volume > 1.0 ? 1.0 : volume;
        
        playbackRate = playbackRate || 1.0;
        
        var source      = context.createBufferSource(),
            gainNode    = context.createGain(),
            duration    = buffer.duration,
            currTime    = context.currentTime;
        
        gainNode.connect(context.destination);
        gainNode.gain.value = volume;
        
        source.buffer = buffer;
        source.playbackRate.value = playbackRate;
        
        if (loop) {
            gainNode.gain.linearRampToValueAtTime(0, currTime);
            gainNode.gain.linearRampToValueAtTime(volume, currTime + 1);
            //source.loop = true;
        }
        
        source.connect(gainNode);
        source.start(0);
        
        if (loop) {
            gainNode.gain.linearRampToValueAtTime(volume, currTime + duration-1);
            gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
            var recurse = arguments.callee;
            context.timer = setTimeout(function() {
                recurse(buffer, volume, loop);
            }, (duration - 1) * 1000);
        }
        
        return source;
    };
    
    this.stop = function (source) {
        source.stop(0);
    };
    
}