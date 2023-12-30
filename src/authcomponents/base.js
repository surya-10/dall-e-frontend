import { useNavigate } from "react-router-dom";

function Base(){
    let navigate = useNavigate();
    return (
        <div className="base-div">
            <div className="container min-vh-100 d-flex justify-content-center flex-row min-vh-100 align-content-center align-items-center">
                <div className="main-div">
                <h3 className="text-center fw-bolder">Get started</h3>
                        <div className="d-flex justify-content-center align-items-center gap-2 flex-md-row flex-column mt-3">
                        <button className="base-login" onClick={()=>navigate("/login")}>Login</button>
                        <button className="base-signup" onClick={()=>navigate("/signup")}>Signup</button>
                        </div>
                </div>
            </div>
        </div>
    )
}
export default Base;
