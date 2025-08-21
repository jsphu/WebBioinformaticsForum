import React from "react";
//import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

function Login() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 d-flex align-itmes-center">
                    <div className="content text-center px-4">
                        <h1 className="text-primary">
                            Web Bioinformatics Forum
                        </h1>
                        <p>
                            Welcome
                            {/*<Link to="/register/">here</Link>.*/}{" "}
                            {/* Uncomment above after written register form */}
                        </p>
                    </div>
                </div>
                <div className="col-md-6 p-5">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
