import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Video from "./Video";

function ImageDisplay({ id ,isPost}) {
    const [fileType, setFileType] = useState(null);
    const [fileSrc, setFileSrc] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const config = {
        responseType: 'arraybuffer',
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost/attachment/getFile/${id}`, config);
            const contentType = response.headers['content-type'];
            setFileType(contentType.split('/')[0]); // Get the file type (e.g., 'image' or 'video')

            const blob = new Blob([response.data], { type: contentType });
            const objectUrl = URL.createObjectURL(blob);
            setFileSrc(objectUrl);
        };

        fetchData();
    }, [id]);

    if (fileType === 'image') {
        return <img src={fileSrc} alt="Image" />;
    } else if (fileType === 'video') {
        if (!isPost){
            return <video src={fileSrc} />;
        }else {
            return <Video src={fileSrc}/>
        }
    } else {
        return <div>Loading...</div>;
    }
}

export default ImageDisplay;
