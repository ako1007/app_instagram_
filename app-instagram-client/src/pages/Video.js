import React, { useState, useRef } from "react";
const Video = ({src}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const videoRef = useRef(null);

    const handlePlay = () => {
        if (!isPlaying) {
            videoRef.current.play();
            setIsPlaying(true);
        }else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div>
            <video onClick={handlePlay} loop={true} ref={videoRef} src={src} />
        </div>
    );
};

export default Video;
