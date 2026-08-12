import React, { useState, useEffect, useRef, useContext } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import {
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiFillStop,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { GlobalState } from "../../GlobalState";

/* ------------------------------------------------------------------
   Reusable "Listen" audio player. Mirrors the blog reader's behavior
   (MainContainer.jsx): logged-in users get premium OpenAI MP3 via
   /api/tts/synthesize; everyone else (or any failure) falls back to
   the free browser Web Speech voice. Styled for the dark theme.

   Props:
     text  — the content to read aloud (markdown is stripped first)
------------------------------------------------------------------ */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid
    ${(props) =>
      props.red ? "rgba(224, 98, 94, 0.4)" : "rgba(91, 179, 158, 0.35)"};
  background: ${(props) =>
    props.red ? "rgba(224, 98, 94, 0.08)" : "rgba(91, 179, 158, 0.08)"};
  color: ${(props) => (props.red ? "#e0625e" : "#5bb39e")};
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.red ? "rgba(224, 98, 94, 0.16)" : "rgba(91, 179, 158, 0.16)"};
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }

  svg {
    font-size: 15px;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorNote = styled.span`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #a3acb2;
`;

/* Strip common markdown tokens so the voice doesn't read "hash hash star". */
const stripMarkdown = (md = "") =>
  md
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^\s*>\s?/gm, "") // blockquotes
    .replace(/^\s*[-*+]\s+/gm, "") // bullet markers
    .replace(/(\*\*|__|\*|_|~~)/g, "") // emphasis markers
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, ". ") // paragraph breaks -> pause
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

const ListenButton = ({ text }) => {
  const globalState = useContext(GlobalState);
  const [token] = globalState.token;
  const [isLoggedIn] = globalState.userAPI.isLoggedIn;

  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const audioRef = useRef(null); // <audio> for OpenAI MP3
  const audioUrlRef = useRef(null); // blob URL for cleanup
  const utteranceRef = useRef(null); // Web Speech utterance

  const speech = stripMarkdown(text);

  // Clean up audio when the content changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [text]);

  const playWebSpeechFallback = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setError("Audio not supported in this browser.");
      return;
    }
    const u = new SpeechSynthesisUtterance(speech);
    u.rate = 0.95;
    u.onend = () => {
      setPlaying(false);
      setPaused(false);
    };
    utteranceRef.current = u;
    synth.speak(u);
    setPlaying(true);
    setPaused(false);
  };

  const playOpenAIVoice = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "/api/tts/synthesize",
        { text: speech },
        { headers: { Authorization: token }, responseType: "blob" }
      );
      const url = URL.createObjectURL(res.data);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setPlaying(false);
        setPaused(false);
      };
      await audio.play();
      setPlaying(true);
      setPaused(false);
    } catch (err) {
      // Surface what went wrong, then fall back to the free browser voice.
      let msg = "Using browser voice (premium unavailable).";
      if (err.response?.status === 429) {
        msg = "Daily premium listen reached — using browser voice.";
      } else if (err.response?.data) {
        try {
          const errText = await err.response.data.text();
          const parsed = JSON.parse(errText);
          if (parsed.msg) msg = `${parsed.msg} — using browser voice.`;
          console.error("Audio error response:", parsed);
        } catch (parseErr) {
          console.error("Error parsing audio error response:", parseErr);
        }
      }
      setError(msg);
      playWebSpeechFallback();
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (loading) return;
    // Resume a paused MP3
    if (paused && audioRef.current) {
      audioRef.current.play();
      setPaused(false);
      setPlaying(true);
      return;
    }
    // Resume paused browser speech
    if (paused && window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      setPlaying(true);
      return;
    }
    // Fresh play
    if (isLoggedIn && token) {
      playOpenAIVoice();
    } else {
      playWebSpeechFallback();
    }
  };

  const handlePause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    } else if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
    }
    setPaused(true);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(false);
    setPaused(false);
  };

  if (!speech) return null;

  return (
    <Controls>
      {loading ? (
        <Button disabled>
          <AiOutlineLoading3Quarters className="spin" />
          Loading…
        </Button>
      ) : !playing ? (
        <Button onClick={handlePlay}>
          <AiFillPlayCircle />
          Listen
        </Button>
      ) : paused ? (
        <Button onClick={handlePlay}>
          <AiFillPlayCircle />
          Resume
        </Button>
      ) : (
        <Button onClick={handlePause}>
          <AiFillPauseCircle />
          Pause
        </Button>
      )}
      {playing && (
        <Button red onClick={handleStop}>
          <AiFillStop />
          Stop
        </Button>
      )}
      {error && <ErrorNote>{error}</ErrorNote>}
    </Controls>
  );
};

export default ListenButton;
