import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Signup() {
    let navigate = useNavigate();
    let [password, setPassword] = useState("");
    let[email, setEmail] = useState("");
    let [error, setError] = useState(false);
    let [googleEmail, setGoogleLogin] = useState("");
    let [resp, setResp] = useState(false);
    let [msg, setMsg] = useState("");
    let [btn, setBtn] = useState("continue");
    let [view, setView] = useState("view");
    let [type, setType] = useState("password")

    async function handleSubmit(e){
        e.preventDefault()
        setBtn("Verifying....")
        if(password.length<8){
            setError(true);
            setBtn("Continue");

        }
        else if(password.length>15){
            setError(true);
            setBtn("Continue");
        }
        else{
            setError(false);
            
        try {
            let obj = {
                email,
                password
            }
            let result = await fetch("https://dall-e-backend-3wtv.onrender.com/user/signup", {
                method:"POST",
                body:JSON.stringify(obj),
                headers:{
                    "content-type":"application/json"
                }
            })
            let updatedResult = await result.json();
            if(updatedResult.resp==true && updatedResult.msg=="success"){
                navigate("/create-image");
            }
            else if(updatedResult.resp==false && updatedResult.msg=="exists"){
                setResp(true);
                setMsg("Email already exist");
            }
            else if(updatedResult.resp==false && updatedResult.msg=="server error"){
                setResp(true);
                setMsg("Server error");
            }
        } catch (error) {
           console.log(error); 
        }
        finally{
            setBtn("Continue");
        }
    }
    }

    function handlePasswordChange(e){
        setMsg("");
        setResp(false);
        setPassword(e.target.value);
        
    }

    function handleEmailChange(e){
        setMsg("");
        setResp(false);
        setEmail(e.target.value);
    }

    function loginUsingGoogle(){
        let userData = {
            email:googleEmail,
            expiretime:Date.now() + 7 * 24 * 60 * 60 * 1000
        }
        localStorage.setItem("login-using-google", userData);
        navigate("/create-image");
    }

    function showPass(){
        if(view=="hide"){
            setType("password");
            setView("view");
        }
        else{
            setType("text");
            setView("hide");
        }
    }
    return (
        <div className="signup-div">
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center min-vh-100 align-content-center">
                    <div className="col-md-8 col-lg-5 mx-auto">
                        <p className="title fw-bold m-2 mb-4 h2 text-center">Create your account</p>
                        <div className="signup">
                            <div className="manual-sign">
                                <form onSubmit={(e)=>handleSubmit(e)}>
                            
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required
                                    value={email}
                                    onChange={(e)=>handleEmailChange(e)}/>
                                        <label for="floatingInput">Email address</label>
                                </div>
                                <div class="form-floating mb-3 ff">
                                    <input type={type} class="form-control frm" id="floatingInput" placeholder="password" required
                                    value={password}
                                    onChange={(e)=>handlePasswordChange(e)}/>
                                        <label for="floatingInput">Password</label>
                                        <p className="view-msg" onClick={showPass}>{view}</p>
                                </div>
                                {error &&<p style={{color:"red"}}>Password length must be greater than 7 and must be less than 16 characters</p>}
                                {resp && <p style={{color:"red", textAlign:"center"}}>{msg}</p>}
                                <div className="btn-div mt-4">
                                    <button className="continue-btn" type="submit">{btn}</button>
                                </div>
                                </form>
                            </div>
                            <p className="text-center m-3"><small className="acc">Already have an account ?</small><span className="login" onClick={()=>navigate("/login")}>Log in</span></p>
                            <div className="or-div">
                            <hr className="hr"/>
                            <p className="or">or</p>
                            </div>
                            <div className="google-sign">
                               
                                <GoogleLogin
                                theme="filled_blue"
                                size="large"
                                width={280}
                                shape="circular"
                                style={{ width: '100%' }}
                                onSuccess={credentialResponse=>{
                                let userCredential =  jwtDecode(credentialResponse.credential);
                                console.log(userCredential);
                                setGoogleLogin(userCredential.email);
                                loginUsingGoogle();
                                }
                            }
                            onError={(error)=>{
                                console.log(error);
                            }}
                                />

                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Signup;