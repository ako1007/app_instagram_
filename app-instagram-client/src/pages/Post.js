import React, {useState} from 'react';
import {Button, Modal, ModalBody, ModalHeader} from "reactstrap";
import axios from "axios";

const Post = ({modal, openModal}) => {
    const [file, setFile] = useState(null);
    const token = localStorage.getItem('jwtToken');
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost/attachment', formData, config)
            .then((response) => {
                let attachmentId = response.data
                let captions = document.getElementById('caption').value
                let tags = document.getElementById('tags').value
                let obj = {
                    fileId: attachmentId, caption: captions, tag: tags
                }
                axios.post('http://localhost/api/post/add', obj, config).then(()=>{
                    window.location.reload()
                })
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (<>

        <Modal isOpen={modal} className="postModal" toggle={openModal} centered>
            <ModalHeader className="postModalHeader" toggle={openModal}>Add Post</ModalHeader>
            <ModalBody className="postModalBody">
                <form onSubmit={handleSubmit}>
                    <input className="form-control" type="file" onChange={handleFileChange}/>
                    <input id="caption" className="form-control" placeholder="Caption" type="text" />
                    <input id="tags" className="form-control" placeholder="Tags" type="text" />
                    <Button color="secondary" onClick={openModal}>Close</Button>
                    <button onClick={openModal} type="submit">Upload</button>
                </form>
            </ModalBody>
        </Modal>
    </>)
}

export default Post;