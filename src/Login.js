import React from 'react';


class Login extends React.Component {
    render(){
        return (
            <>

                <form className="form-signin">
                    <div className="text-center mb-4">
                        <h1 className="my-5 ">Sign in or create an account bellow</h1>
                    </div>

                    <div className="form-label-group mt-5">
                        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
                        <label htmlFor="inputEmail">Email address</label>
                    </div>

                    <div className="form-label-group">
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                        <label htmlFor="inputPassword">Password</label>
                    </div>

                    <div className="checkbox mb-3">
                        <label>
                            <input type="checkbox" value="remember-me" /> Remember me
                </label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.props.handleLogIn}>Sign in</button>

                </form>

                <div className="form-signin mb-5 text-center">
                    <button className="btn btn-lg btn-success btn-block" onClick={this.props.handleLogIn}>Sign in with <i className="fab fa-google"></i></button>
                    <button className="btn" ><a className="text-decoration-none" href="">or create an account</a></button>
                </div>

            </>
        )
    }
}
export default Login;

