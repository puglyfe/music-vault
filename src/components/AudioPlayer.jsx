/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faVolumeDown,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import "twin.macro";

import debug from "../utils/debug";
import formatTime from "../utils/formatTime";

const sliderStyles = css`
  input[type="range" i]::-moz-range-thumb {
    appearance: none;
    background-color: rgba(248, 113, 113, var(--tw-text-opacity));
    border: 5px solid rgba(31, 41, 55, var(--tw-bg-opacity));
    border-radius: 50%;
    height: 16px;
    width: 16px;
  }

  input[type="range" i]::-webkit-slider-thumb {
    appearance: none;
    background-color: rgba(248, 113, 113, var(--tw-text-opacity));
    border: 5px solid rgba(31, 41, 55, var(--tw-bg-opacity));
    border-radius: 50%;
    height: 16px;
    width: 16px;
  }
`;

const AudioPlayer = ({ currentTrack }) => {
  const rafId = useRef(null);
  const playerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isSeekingRef = useRef(false);

  const [playerState, setPlayerState] = useState({
    duration: 0,
    playing: false,
    seek: 0.0,
    volume: 1.0,
  });
  const [lastVolume, setLastVolume] = useState(1.0);

  useEffect(() => {
    debug.log("useEffect", { rafId });
    return () => {
      debug.log("unmounting", { rafId });
      if (rafId) {
        cancelAnimationFrame(rafId.curent);
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && currentTrack) {
      setPlayerState((prevState) => ({
        ...prevState,
        playing: true,
      }));
    }
  }, [currentTrack]);

  const { duration, playing, seek, volume } = playerState;

  const renderSeekPos = () => {
    debug.log("renderSeekPos");
    if (!isSeekingRef.current) {
      setPlayerState((prevState) => ({
        ...prevState,
        seek: playerRef.current.getCurrentTime(),
      }));
    }
    if (isPlayingRef.current) {
      rafId.current = requestAnimationFrame(renderSeekPos);
    }
  };

  const toggleMute = () => {
    debug.log("toggleMute");
    // Keep the last volume before muting so we can restore it.
    setLastVolume(volume > 0 ? volume : 1.0);
    setPlayerState((prevState) => ({
      ...prevState,
      volume: volume > 0 ? 0 : lastVolume,
    }));
  };

  const togglePlay = () => {
    debug.log("togglePlay");
    isPlayingRef.current = !isPlayingRef.current;
    setPlayerState((prevState) => ({
      ...prevState,
      playing: !playing,
    }));
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return faVolumeMute;
    } else if (volume < 0.6) {
      return faVolumeDown;
    }
    return faVolumeUp;
  };

  const handleMouseDownSeek = () => {
    isSeekingRef.current = true;
  };

  const handleMouseUpSeek = (e) => {
    isSeekingRef.current = false;
    playerRef.current.seekTo(e.target.value);
  };

  const handleOnEnded = () => {
    debug.log("handleOnEnded");
    setPlayerState((prevState) => ({
      ...prevState,
      playing: false,
    }));
    cancelAnimationFrame(rafId);
  };

  const handleOnDuration = (duration) => {
    debug.log("handleOnDuration", duration);
    setPlayerState((prevState) => ({
      ...prevState,
      duration,
    }));
  };

  const handleOnPause = () => {
    debug.log("handleOnPause");
  };

  const handleOnPlay = () => {
    debug.log("handleOnPlay");
    isPlayingRef.current = true;
    setPlayerState((prevState) => ({
      ...prevState,
      playing: true,
    }));
    renderSeekPos();
  };

  const handleSeekingChange = (e) => {
    debug.log("handleSeekingChange");
    e.persist();
    setPlayerState((prevState) => ({
      ...prevState,
      seek: parseFloat(e.target.value),
    }));
  };

  const handleVolumeChange = (e) => {
    debug.log("handleVolumeChange");
    e.persist();
    setPlayerState((prevState) => ({
      ...prevState,
      volume: parseFloat(e.target.value),
    }));
  };

  return (
    <Fragment>
      <ReactPlayer
        height={0}
        onDuration={handleOnDuration}
        onEnded={handleOnEnded}
        onPause={handleOnPause}
        onPlay={handleOnPlay}
        playing={playing}
        ref={playerRef}
        url={currentTrack.src}
        volume={volume}
        width={0}
      />
      <div
        css={sliderStyles}
        tw="flex flex-row space-x-2 items-center justify-between max-w-7xl mx-auto p-4"
      >
        <div tw="w-1/4">
          <div tw="flex flex-col">
            <span tw="text-sm truncate">{currentTrack.artist}</span>
            <span tw="font-semibold text-sm truncate">
              {currentTrack.title}
            </span>
          </div>
        </div>
        <div tw="w-1/2">
          <div tw="flex flex-col space-y-2">
            <div tw="flex flex-row items-center justify-center space-x-2 text-red-400">
              <button
                onClick={togglePlay}
                type="button"
                title={playing ? "Pause Track" : "Play Track"}
                tw="inline-flex justify-center items-center h-8 w-8 rounded-full shadow-neu"
              >
                {playing ? (
                  <Fragment>
                    <span tw="sr-only">Pause Track</span>
                    <FontAwesomeIcon icon={faPause} size="sm" />
                  </Fragment>
                ) : (
                  <Fragment>
                    <span tw="sr-only">Play Track</span>
                    <FontAwesomeIcon icon={faPlay} size="sm" />
                  </Fragment>
                )}
              </button>
            </div>
            <div tw="flex flex-row items-center justify-between space-x-2 mb-2">
              <span tw="tabular-nums text-gray-400 text-xs">
                {formatTime(seek)}
              </span>
              <input
                tw="appearance-none bg-red-400 rounded-lg h-2 w-full shadow-neu"
                type="range"
                min="0"
                max={duration ? duration.toFixed(2) : 0}
                step=".01"
                value={seek}
                readOnly
                onChange={handleSeekingChange}
                onMouseDown={handleMouseDownSeek}
                onMouseUp={handleMouseUpSeek}
              />
              <span tw="tabular-nums text-gray-400 text-xs">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
        <div tw="w-1/4">
          <div tw="flex flex-row space-x-2 items-center justify-end">
            <button
              onClick={toggleMute}
              tw="flex-initial inline-block text-gray-400 text-left w-5"
              type="button"
            >
              <FontAwesomeIcon icon={getVolumeIcon()} />
            </button>
            <span tw="flex-initial">
              <input
                tw="appearance-none bg-red-400 rounded-lg h-2 w-full shadow-neu"
                type="range"
                min="0"
                max="1"
                step=".05"
                value={volume}
                onChange={handleVolumeChange}
              />
            </span>
          </div>
        </div>
      </div>
      {/* <pre>
        <code>{JSON.stringify(playerState, null, 2)}</code>
      </pre> */}
    </Fragment>
  );
};

export default AudioPlayer;
