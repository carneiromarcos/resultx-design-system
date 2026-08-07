/**
 * ResultX Design System — Audio player
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/audio-player.js"></script>
 *
 * API:
 *   ResultXAudioPlayer.init(root)   — enhance every [data-audio-player]
 *   ResultXAudioPlayer.play(el)
 *   ResultXAudioPlayer.pause(el)
 *   ResultXAudioPlayer.seek(el, seconds)
 *
 * Behavior:
 *   - Progressive enhancement over a native <audio controls>. Without this
 *     script the browser's own player is visible and the audio still plays.
 *   - The waveform is a slider: focusable, arrow keys seek ±5s, Home/End jump
 *     to the ends, and aria-valuetext announces the position out loud.
 *   - Rate cycles 1× → 1.5× → 2× → 1×.
 *   - Only one player sounds at a time; starting one pauses the others.
 *   - Dispatches 'audioplaystate' with detail { playing }.
 */
;(function () {
  'use strict';

  var READY_ATTR = 'data-audio-ready';
  var RATES = [1, 1.5, 2];
  var STEP_SECONDS = 5;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var total = Math.floor(seconds);
    var mins = Math.floor(total / 60);
    var secs = total % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function parts(el) {
    return {
      audio: el.querySelector('.audio-native'),
      play: el.querySelector('.audio-play'),
      wave: el.querySelector('.audio-wave'),
      time: el.querySelector('.audio-time'),
      rate: el.querySelector('.audio-rate'),
      bars: el.querySelectorAll('.audio-bar'),
    };
  }

  /* Pinta as barras ja tocadas e move o valor anunciado. Uma classe por barra,
     em vez de acrobacia de CSS: o navegador so repinta o que mudou. */
  function render(el) {
    var p = parts(el);
    if (!p.audio) return;

    var duration = isFinite(p.audio.duration) ? p.audio.duration : 0;
    var current = p.audio.currentTime || 0;
    var ratio = duration > 0 ? current / duration : 0;
    var upTo = Math.round(ratio * p.bars.length);

    for (var i = 0; i < p.bars.length; i++) {
      var played = i < upTo;
      if (p.bars[i].classList.contains('audio-bar-played') !== played) {
        p.bars[i].classList.toggle('audio-bar-played', played);
      }
    }

    if (p.time) {
      p.time.textContent = formatTime(current > 0 ? current : duration);
    }

    if (p.wave) {
      p.wave.setAttribute('aria-valuenow', String(Math.round(current)));
      p.wave.setAttribute('aria-valuemax', String(Math.round(duration)));
      p.wave.setAttribute(
        'aria-valuetext',
        formatTime(current) + ' de ' + formatTime(duration)
      );
    }
  }

  function setIcon(el, playing) {
    var p = parts(el);
    if (!p.play) return;
    p.play.setAttribute('aria-label', playing ? 'Pausar' : 'Reproduzir');
    p.play.setAttribute('data-state', playing ? 'playing' : 'paused');
  }

  function pause(el) {
    var p = parts(el);
    if (p.audio) p.audio.pause();
  }

  function play(el) {
    var p = parts(el);
    if (!p.audio) return;
    /* Dois audios ao mesmo tempo nao e recurso, e defeito. */
    var todos = document.querySelectorAll('[data-audio-player]');
    for (var i = 0; i < todos.length; i++) {
      if (todos[i] !== el) pause(todos[i]);
    }
    var promessa = p.audio.play();
    if (promessa && promessa.catch) {
      /* Autoplay bloqueado ou arquivo ausente: o estado se corrige sozinho no
         evento 'pause'. Nao ha o que fazer alem de nao explodir. */
      promessa.catch(function () {});
    }
  }

  function seek(el, seconds) {
    var p = parts(el);
    if (!p.audio || !isFinite(p.audio.duration)) return;
    p.audio.currentTime = Math.min(Math.max(seconds, 0), p.audio.duration);
    render(el);
  }

  function seekFromPointer(el, clientX) {
    var p = parts(el);
    if (!p.wave || !p.audio || !isFinite(p.audio.duration)) return;
    var box = p.wave.getBoundingClientRect();
    if (box.width === 0) return;
    var ratio = (clientX - box.left) / box.width;
    seek(el, ratio * p.audio.duration);
  }

  function cycleRate(el) {
    var p = parts(el);
    if (!p.audio || !p.rate) return;
    var atual = RATES.indexOf(p.audio.playbackRate);
    var proxima = RATES[(atual + 1) % RATES.length];
    p.audio.playbackRate = proxima;
    p.rate.textContent = proxima + '×';
    p.rate.setAttribute('aria-label', 'Velocidade ' + proxima + '×');
  }

  function enhance(el) {
    if (el.hasAttribute(READY_ATTR)) return;
    var p = parts(el);
    /* Sem <audio> nao ha o que controlar: melhor deixar como esta do que
       mostrar uma interface que nao toca nada. */
    if (!p.audio || !p.play) return;

    el.setAttribute(READY_ATTR, '');
    p.audio.removeAttribute('controls');

    if (p.wave) {
      p.wave.setAttribute('role', 'slider');
      p.wave.setAttribute('aria-label', 'Posição do áudio');
      p.wave.setAttribute('aria-valuemin', '0');
      if (!p.wave.hasAttribute('tabindex')) p.wave.setAttribute('tabindex', '0');
    }

    if (p.rate) {
      p.rate.textContent = p.audio.playbackRate + '×';
      p.rate.addEventListener('click', function () {
        cycleRate(el);
      });
    }

    p.play.addEventListener('click', function () {
      if (p.audio.paused) play(el);
      else pause(el);
    });

    p.audio.addEventListener('play', function () {
      setIcon(el, true);
      el.dispatchEvent(
        new CustomEvent('audioplaystate', { bubbles: true, detail: { playing: true } })
      );
    });

    p.audio.addEventListener('pause', function () {
      setIcon(el, false);
      el.dispatchEvent(
        new CustomEvent('audioplaystate', { bubbles: true, detail: { playing: false } })
      );
    });

    p.audio.addEventListener('timeupdate', function () {
      render(el);
    });

    p.audio.addEventListener('loadedmetadata', function () {
      render(el);
    });

    p.audio.addEventListener('ended', function () {
      seek(el, 0);
      setIcon(el, false);
    });

    if (p.wave) {
      p.wave.addEventListener('pointerdown', function (event) {
        event.preventDefault();
        seekFromPointer(el, event.clientX);
      });

      p.wave.addEventListener('keydown', function (event) {
        var atual = p.audio.currentTime || 0;
        var key = event.key;
        if (key === 'ArrowLeft') seek(el, atual - STEP_SECONDS);
        else if (key === 'ArrowRight') seek(el, atual + STEP_SECONDS);
        else if (key === 'Home') seek(el, 0);
        else if (key === 'End') seek(el, p.audio.duration);
        else if (key === ' ' || key === 'Enter') {
          if (p.audio.paused) play(el);
          else pause(el);
        } else return;
        event.preventDefault();
      });
    }

    setIcon(el, false);
    render(el);
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-audio-player]');
    for (var i = 0; i < nodes.length; i++) {
      enhance(nodes[i]);
    }
    return nodes.length;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }

  window.ResultXAudioPlayer = {
    init: init,
    play: play,
    pause: pause,
    seek: seek,
  };
})();
