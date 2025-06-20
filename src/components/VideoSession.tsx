import React, { useEffect, useRef } from 'react';

interface VideoSessionProps {
  room: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

const VideoSession: React.FC<VideoSessionProps> = ({ room }) => {
  const jitsiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.JitsiMeetExternalAPI && jitsiContainer.current) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: room,
        parentNode: jitsiContainer.current,
        width: '100%',
        height: 600,
      };
      new window.JitsiMeetExternalAPI(domain, options);
    }
  }, [room]);

  return <div ref={jitsiContainer} style={{ minHeight: 600 }} />;
};

export default VideoSession; 