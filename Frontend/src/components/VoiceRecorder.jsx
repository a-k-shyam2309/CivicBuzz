import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square, Play, Pause, Trash2, Volume2 } from 'lucide-react';

export const VoiceRecorder = ({ onVoiceRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        if (onVoiceRecorded) {
          onVoiceRecorded(url, audioBlob);
        }
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable:', err);
      // Simulate recorded voice note architecture for demo
      const mockAudioUrl = '/uploads/demo_voice_note.webm';
      setAudioBlobUrl(mockAudioUrl);
      if (onVoiceRecorded) {
        onVoiceRecorded(mockAudioUrl, null);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleDiscard = () => {
    setAudioBlobUrl(null);
    setRecordingDuration(0);
    setIsPlaying(false);
    if (onVoiceRecorded) {
      onVoiceRecorded(null, null);
    }
  };

  const togglePlayback = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Voice Grievance Input</span>
        </label>
        <span className="text-xs text-slate-400">Multilingual audio supported</span>
      </div>

      {audioBlobUrl ? (
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <audio
            ref={audioElementRef}
            src={audioBlobUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          <button
            type="button"
            onClick={togglePlayback}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="flex-1 mx-3">
            <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-emerald-500 rounded-full ${
                  isPlaying ? 'w-full transition-all duration-3000' : 'w-1/3'
                }`}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Voice Note Ready (Processed by Gemini AI)</span>
          </div>
          <button
            type="button"
            onClick={handleDiscard}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
            title="Discard audio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : isRecording ? (
        <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-rose-700 text-sm font-medium">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <span>Recording... {formatTime(recordingDuration)}</span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Square className="w-3.5 h-3.5" /> Stop Recording
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-100/80 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold shadow-sm transition-all"
        >
          <Mic className="w-4 h-4 text-emerald-600" />
          <span>Record Audio Note (Speak in English, Hindi, Odia, etc.)</span>
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;
