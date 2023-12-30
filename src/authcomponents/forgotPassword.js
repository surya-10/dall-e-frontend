import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    let [email, setEmail] = useState("");
    let [btn, setBtn] = useState("Verify")
    let navigate = useNavigate();
    async function handleSubmit(e) {
        e.preventDefault();
        setBtn("Sending");
        try {
            let obj = {
                email
            }
            let checkUser = await fetch("https://dall-e-backend-3wtv.onrender.com/user/forgot", {
                method:"POST",
                body:JSON.stringify(obj),
                headers:{
                    "content-type":"application/json"
                }
            });
            let result = await checkUser.json();
            // console.log(result);
            if(result.resp==true && result.msg=="email sent"){
                setBtn("Email sent")
                alert("Email sent. Kindly wait sometime.");
                navigate("/login");
            }
            else if(result.resp==false && result.msg=="not exist"){
                alert("Your email does not exist.");
                navigate("/signup")
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setBtn("Verify")
        }
    }
    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    return (
        <div className="forgot-pass-div">
            <div className="container">
                <div className="row">
                    <div className="row d-flex justify-content-center align-items-center min-vh-100 align-content-center">
                        <div className="col-md-8 col-lg-5 mx-auto">
                            <p className="title fw-bold m-2 mb-4 h2 text-center">Reset your password</p>
                            <p className="text-center fs-6">If your account exists, we will send reset link to your registered email.</p>
                            <div className="signup">
                                <form onSubmit={(e) => handleSubmit(e)}>

                                    <div class="form-floating mb-3">
                                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required
                                            value={email}
                                            onChange={(e) => handleEmailChange(e)} />
                                        <label for="floatingInput">Email address</label>
                                    </div>
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
export default ForgotPassword;