import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import Signup from "./pages/Signup";
import jwt_decode from "jwt-decode";
import InstagramCard from "./InstagramCard";
import UserSettings from "./pages/UserSettings";
import UserChangePassword from "./pages/UserChangePassword";
import OtherProfile from "./pages/OtherProfile";
import {useEffect, useState} from "react";
import Message from "./pages/Message";
import Login from "./pages/Login";
import VerifyRegister from "./pages/VerifyRegister";
import { useNavigate } from "react-router-dom";
import Video from "./pages/Video";



function App() {
    const [username, setUsername] = useState(null);
    useEffect((() => {
        setUsernameFromToken()
    }), [])
    const navigate = useNavigate();

    function setUsernameFromToken() {
        try {
            const token = localStorage.getItem('jwtToken');
            const decodedToken = jwt_decode(token);
            const username = decodedToken.sub
            sessionStorage.setItem("username", username)
            setUsername(username)
        } catch (e) {
            navigate("/login")
        }
    }

    return (
        <div className="App">
            <ToastContainer/>
            <Routes>
                <Route path="/" element={<InstagramCard/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path={'/' + username} element={<ProfilePage/>}/>
                <Route path="/:userr" element={<OtherProfile/>}/>
                <Route path="/accounts/edit" element={<UserSettings/>}/>
                <Route path="/password/change" element={<UserChangePassword/>}/>

                <Route path="/message" element={<Message/>}/>
                <Route path="/v2/verify" element={<VerifyRegister/>}/>
            </Routes>
        </div>
    );
}

export default App;
