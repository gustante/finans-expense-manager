
import React from 'react';

function Login() {

    return(
        
        
        <form className="form-signin">
            <div className="text-center mb-4">
                <h1 className="my-5 ">Sign in or create an account bellow</h1>
            </div>

            <div className="form-label-group mt-5">
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus/>
                <label for="inputEmail">Email address</label>
            </div>

            <div className="form-label-group">
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
                <label for="inputPassword">Password</label>
            </div>

            <div className="checkbox mb-3">
                <label>
                <input type="checkbox" value="remember-me"/> Remember me
                </label>
            </div>
            <div className="text-center mb-5">
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <button className="btn btn-lg btn-success btn-block">Sign in with <i class="fab fa-google"></i></button>
                <button className="btn" ><a className="text-decoration-none" href="">or create an account</a></button>
            </div>
            
            </form>
            

        
    )
}
export default Login;

