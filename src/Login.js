import React from 'react';
import { Link, Navigate } from "react-router-dom";


class Login extends React.Component {

    render() {
        const isLoggedIn = this.props.isLoggedIn;
        return (
            <>
                {isLoggedIn ? (
                    <Navigate to="/dashboard"/>
                ) : (<>

                    <form className="form-signin" onSubmit={this.props.handleLogIn}>
                        <div className="text-center mb-4">
                            <h1 className="my-5 ">Sign in or create an account bellow</h1>
                        </div>

                        <div className="form-label-group mt-5">
                            <input type="email" id="inputEmail" name="email" className="form-control" placeholder="Email address" required onChange={this.props.handleChange} />
                            <label htmlFor="inputEmail">Email address</label>
                        </div>

                        <div className="form-label-group">
                            <input type="password" id="inputPassword" name="password" className="form-control" placeholder="Password" required onChange={this.props.handleChange} />
                            <label htmlFor="inputPassword">Password</label>
                        </div>

                        <div className="checkbox mb-3">
                            <label>
                                <input type="checkbox" value="remember-me" /> Remember me
                            </label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

                    </form>

                    <div className="form-signin mb-5 text-center">
                        <button className="btn btn-lg btn-success btn-block" onClick={this.props.handleGoogleLogIn}>Sign in with <i className="fab fa-google"></i></button>
                        <Link to="/register">
                            <button className="btn" ><a className="text-decoration-none" href="">or create an account</a></button>
                        </Link>

                    </div>


                </>
                    )
                }



            </>
        )
    }
}
export default Login;

