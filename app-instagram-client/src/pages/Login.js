import React, {useState} from 'react';
import "../style/Login.css"
import inst_image from "../images/9364675fb26a.svg"
import inst_logo from "../images/logoinsta.png"
import fb from "../images/fb.png"
import playstore from "../images/play.png"
import microsoft from "../images/microsoft.png"
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLogin, setLogin] = useState(true);
    const changeLogin = () => setLogin(!isLogin);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost/api/auth/authenticate', {username, password});
            const token = response.data.token;
            localStorage.setItem('jwtToken', token)
            navigate(`/${username}`)
        } catch (error) {
            console.error(error);
        }
    };

    function redirecctToPS() {
        window.location.replace('https://play.google.com/store/apps/details?id=com.instagram.android&hl=en&gl=US&pli=1')
    }

    function redirecctToMt() {
        window.location.replace('https://apps.microsoft.com/store/detail/instagram/9NBLGGH5L9XT')
    }

    return (<>
        <div className="s1 m-0 row">
            <div className="col-3"></div>
            <div className="col-6">
                <div className="loginpage_main">
                    <div><img alt="" src={inst_image} width="450px"/></div>
                    <div>
                        <div className="loginpage_rightcomponent">
                            <div>
                                <img alt="" className="loginpage_logo" src={inst_logo}/>
                                <div className="loginpage_signin">
                                    <input className="login_text" type="text"
                                           placeholder="Phone number, username, or email"
                                           value={username} onChange={(e) => setUsername(e.target.value)}/>
                                    <input className="login_text" type="password" placeholder="Password"
                                           value={password} onChange={(e) => setPassword(e.target.value)}/>
                                    <button onClick={handleLogin} className="login_button">Log in</button>
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
                            <div onClick={changeLogin} className="loginpage_login">Don't have an
                                account?<Link to={"/signup"}>Sign up</Link></div>
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

export default Login;