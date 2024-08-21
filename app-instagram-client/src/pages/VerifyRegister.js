import '../style/verifyRegister.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";


function VerifyRegister() {
    const [inputValue, setInputValue] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    useEffect(() => {
        setIsButtonDisabled(inputValue.length !== 6);
    }, [inputValue]);
    const navigate = useNavigate();
    function verifyUser() {
        axios.get('http://localhost/api/auth/verify/'+inputValue).then((response)=>{
            if (response.data.success===true){
                localStorage.setItem('jwtToken',response.data.message)
                navigate('/'+jwt_decode(localStorage.getItem('jwtToken')).sub)
            }
        })
    }

    return (<>
            <div className="aaaverify1">
                <div className="aaaverify2">
                    <div className="aaaverify3">
                        <h1 className="aaaverify3_h1">We sent verification code to your email/phone number</h1>
                        <h2 className="aaaverify3_h2">Please verify your account</h2>
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                               className="aaaverify3_form" type="text" placeholder="Enter verification code here"/>
                        <br/>
                        {
                            isButtonDisabled?<button disabled className="aaaverify3_btn">Submit</button>:
                                <button onClick={verifyUser} className="aaaverify3_btn_enabled">Submit</button>
                        }
                    </div>
                </div>
            </div>
        </>)
}

export default VerifyRegister;