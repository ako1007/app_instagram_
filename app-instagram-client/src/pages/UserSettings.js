import jwt_decode from "jwt-decode";
import {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import '../style/UserSettings.css'
import ImageDisplay from "./ImageDisplay";
import {Modal,ModalBody, ModalHeader} from "reactstrap";
import profileImg from "../images/profileDemo.png";


function UserSettings() {
    const [user, setUser] = useState('');
    const [imageModal,setImageModal]=useState(false)
    const token = localStorage.getItem('jwtToken')
    const [file, setFile] = useState(null);
    const decodedToken = jwt_decode(token)
    const username = decodedToken.sub
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    useEffect(() => {
        getUser()
    }, [])
    function openImageModal() {
        setImageModal(!imageModal)
    }
    function getUser() {
        axios.get('http://localhost/api/v2/user/' + username, config)
            .then(response => {
                setUser(response.data.object)
            }).catch(response => {
            if (response.response.status === 403) {
                window.location.replace('http://localhost:3000/login')
            }
        })
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const formData = new FormData();
    formData.append('file', file);
    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post('http://localhost/attachment', formData,config)
            .then((response) => {
                saveUserAttachment(response.data)
                window.location.reload()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    function saveUserAttachment(attachmentId) {
        const obj={id:attachmentId}
        axios.put('http://localhost/accounts/img',obj, config).then(r  =>console.log(r.data))
    }
    function redirectToPass() {
        window.location.replace('http://localhost:3000/password/change')
    }
    function saveUserSettings(){
        const obj={
            "fullName":document.getElementById("fullName").value,
            "username":document.getElementById("username").value,
            "websiteUrl":document.getElementById("website").value,
            "bio":document.getElementById("bio").value,
            "email":document.getElementById("email").value,
            "phoneNumber":document.getElementById("phoneNumber").value,
            "gender":document.getElementById("gender").value,
            "attachmentId":user.attachmentId
        }
        axios.put('http://localhost/accounts/edit',obj,config).then(resp=>{
            if (resp.data.success===true){
                window.location.reload()
            }else {
                alert('Something went wrong.')
            }
        }).catch(resp=>{
            console.log(resp.data)
        })
    }
    return (
        <>
            <Sidebar/>
            <div className="main">
                <ul className="unor">
                    <li>
                        <a className="unor_a">
                        <div>
                            <div className="choose_btn">
                                <span>Edit profile</span>
                            </div>
                        </div>
                    </a>
                    </li><li>
                        <a onClick={redirectToPass} className="unor_a">
                        <div>
                            <div className="choose_btn">
                                <span>Change password</span>
                            </div>
                        </div>
                    </a>
                    </li>
                </ul>
                <article className="article">
                    <div className="_ab3p">
                        <aside className="_ad6_">
                            <span onClick={openImageModal}>
                                {user.attachmentId == null ? <img alt='' src={profileImg}/> :
                                    <ImageDisplay isPost={false} id={user.attachmentId}/>}
                            </span>
                        </aside>
                        <div className="_ab3t">
                            <div className="x9f619">
                                <span>{user.username}</span> <br/>
                                <span className="x9f619_span"  onClick={openImageModal}>Change profile photo</span>
                            </div>
                        </div>
                    </div>
                    <form>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="fullName">Name</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <input aria-required="false" id="fullName" placeholder="Name" type="text"
                                               className="_ab3_"  defaultValue={user.fullName}/>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="username">Username</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <input aria-required="true" id="username" placeholder="Username" type="text"
                                               className="_ab3_" defaultValue={user.username}/>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="website">Website</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <input aria-required="false" id="website" placeholder="Website"
                                               type="text" className="_ab3_"  defaultValue={user.website!=null?user.website:null}/>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="bio">Bio</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <textarea defaultValue={user.bio!=null?user.bio:null} className="_ab44" id="bio"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="email">Email</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <input aria-required="false" id="email" placeholder="Email" type="text"
                                               className="_ab3_" defaultValue={user.email!=null?user.email:null}/>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="phoneNumber">Phone number</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <input aria-required="false" id="phoneNumber" placeholder="Phone number"
                                               type="text" className="_ab3_" defaultValue={user.phoneNumber!=null?user.phoneNumber:null}/>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                    <label className="_ab3q" htmlFor="gender">Gender</label>
                                </aside>
                                <div className="_ab3t">
                                    <div className="x9f619">
                                        <select className="_ab3_" name="" id="gender">
                                            {user.gender === 'MALE' ? (
                                                <>
                                                    <option style={{color:"black"}} value="MALE" selected>Male</option>
                                                    <option style={{color:"black"}} value="FEMALE">Female</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option style={{color:"black"}} value="MALE">Male</option>
                                                    <option style={{color:"black"}} value="FEMALE" selected>Female</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="_ab3p">
                                <aside className="_ad6_">
                                </aside>
                                <div className="_ab3t">
                                    <div className="_ab47">
                                        <button onClick={saveUserSettings} type="button" className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                    </form>
                </article>
            </div>
            <Modal className="image_upload" isOpen={imageModal} toggle={openImageModal}>
                <ModalHeader className="image_upload">
                    <h4 className='text-white text-center mb-2'>Upload photo</h4>

                </ModalHeader>
                <ModalBody className="image_upload">
                    <form className='form-control' onSubmit={handleSubmit}>
                        <input className='form-control' type="file" onChange={handleFileChange} />
                        <button className='btn btn-primary mt-2' type="submit">Upload</button>
                    </form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default UserSettings;