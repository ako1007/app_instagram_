import React, {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import inst_image from "../images/9364675fb26a.svg";
import inst_logo from "../images/logoinsta.png";
import fb from "../images/fb.png";
import playstore from "../images/play.png";
import microsoft from "../images/microsoft.png";
import {Link} from "react-router-dom";

function Signup() {
    const [isLogin, setLogin] = useState(true);
    const changeLogin = () => setLogin(!isLogin);

    function redirecctToPS() {
        window.location.replace('https://play.google.com/store/apps/details?id=com.instagram.android&hl=en&gl=US&pli=1')
    }

    function redirecctToMt() {
        window.location.replace('https://apps.microsoft.com/store/detail/instagram/9NBLGGH5L9XT')
    }

    function register() {
        const data = {
            "fullName": document.getElementById("name").value,
            "username": document.getElementById("username").value,
            "emailOrPH": document.getElementById("emailOrPh").value,
            "password": document.getElementById('password').value
        }
        axios.post('http://localhost/api/auth/register', data)
            .then((response) => {
                if (response.data.success === true) {
                    window.location.replace('http://localhost:3000/v2/verify')
                } else {
                    toast.error(response.data.message);
                }
            })
    }

    return (<>
        <div className="s2 m-0 row">
            <div className="col-3"></div>
            <div className="col-6">
                <div className="loginpage_main">
                    <div><img alt="" src={inst_image} width="450px"/></div>
                    <div>
                        <div className="loginpage_rightcomponent">
                            <div>
                                <img alt="" className="loginpage_logo" src={inst_logo}/>
                                <div className="loginpage_signin">
                                    <input id="emailOrPh" className="login_text" type="text"
                                           placeholder="Mobile number or email"/>
                                    <input id="name" className="login_text" type="text" placeholder="Full name"/>
                                    <input id="username" className="login_text" type="text" placeholder="Username"/>
                                    <input id="password" className="login_text" type="password" placeholder="Password"/>
                                    <button onClick={register} className="login_button">Sign up</button>
                                </div>
                                <div className="login_ordiv">
                                    <div className="login_divider"></div>
                                    <div className="login_or">OR</div>
                                    <div className="login_divider"></div>
                                </div>
                                <div className="login_fb"><img alt="" width="15px" src={fb}/>Log in with Facebook</div>
                                <div className="login_forgot"><a href="#">Forgot password?</a></div>
                            </div>
                        </div>
                        <div className="loginpage_signupdiv">
                            <div onClick={changeLogin} className="loginpage_signup">Have an account?<Link to={"/login"}>Log in</Link>
                            </div>
                        </div>
                        <div className="loginpage_downloadSection">
                            <div>Get the app</div>
                            <div className="loginpage_downloadoption">
                                <img onClick={redirecctToPS} className="loginpage_dwimg" src={playstore} width="136px"
                                     height="40px" alt=""/>
                                <img onClick={redirecctToMt} className="loginpage_dwimg" src={microsoft} width="113px"
                                     height="40px" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-3"></div>
        </div>
    </>);
}

export default Signup;