import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePassword(){
    let [btn, setBtn] = useState("Update")
    let navigate = useNavigate();
    let [password, setPassword] = useState("");
    let [resp, setResp] = useState(false);
    let [msg, setMsg] = useState("");
    let [view, setView] = useState("view");
    let [type, setType] = useState("password");
    let [error, setError] = useState(false);
    let {id, token} = useParams();
    async function handleSubmit(e){
        e.preventDefault();
        setBtn("Verifing...");
        if (password.length < 8) {
            setError(true);
            setBtn("Update");

        }
        else if (password.length > 15) {
            setError(true);
            setBtn("Update");
        }
        else {
            setError(false);
            try{
                setBtn("Updating...")
                let obj = {
                    password
                }
                let UpdatePassword = await fetch(`https://dall-e-backend-3wtv.onrender.com/user/update/${id}/${token}`, {
                    method:"POST",
                    body:JSON.stringify(obj),
                    headers:{
                        "content-type":"application/json"
                    }
                })
                let result = await UpdatePassword.json();
                if(result.resp===false && result.msg === "expired"){
                    setResp(true);
                    setMsg("Link has been expired");
                }
                else if(result.resp===true && result.msg==="updated"){
                    alert("New password has been updated");
                    navigate("/login");
                }
                else if(result.resp===false && result.msg==="not exist"){
                    setResp(true);
                    setMsg("Your account does not exist.");
                    setTimeout(()=>{
                        navigate("/signup");
                    }, 2000)
                }
            }
            catch(error){
                console.log(error);
            }
            finally{
                setBtn("Update");
            }
        }
    }

    function handlePasswordChange(e){
        setMsg("");
        setResp(false);
        setError(false);
        setMsg(false);
        setPassword(e.target.value);
    }

    function showPass(){
        if(view==="hide"){
            setType("password");
            setView("view");
        }
        else{
            setType("text");
            setView("hide");
        }
    }
    return (
        <div className="update-pass">
            <div className="container">
                <div className="row">
                    <div className="row d-flex justify-content-center align-items-center min-vh-100 align-content-center">
                        <div className="col-md-8 col-lg-5 mx-auto">
                            <p className="title fw-bold m-2 mb-4 h2 text-center">Create new password</p>
                            <p className="text-center fs-6">Enter a new password below to change your password.</p>
                            <div className="signup">
                                <form onSubmit={(e) => handleSubmit(e)}>

                                <div class="form-floating mb-3 ff">
                                    <input type={type} class="form-control frm" id="floatingInput" placeholder="password" required
                                    value={password}
                                    onChange={(e)=>handlePasswordChange(e)}/>
                                        <label for="floatingInput">Password</label>
                                        <p className="view-msg" onClick={showPass}>{view}</p>
                                </div>
                                {error &&<p style={{color:"red"}}>Password length must be greater than 7 and must be less than 16 characters</p>}
                                {resp && <p style={{color:"red", textAlign:"center"}}>{msg}<span className="btn bg-danger text-white ms-2" onClick={()=>navigate("/forgot-password")}>Resend</span></p>}
                                    <div className="btn-div mt-4">
                                        <button className="continue-btn" type="submit">{btn}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UpdatePassword;