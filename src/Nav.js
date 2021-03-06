import React from 'react';
import { Link } from "react-router-dom";

class Nav extends React.Component {

    collapse(){
        console.log("removing ")
        $("div .collapse").removeClass("show")


    }


    render() {
        const isLoggedIn = this.props.isLoggedIn;
        return (
            <>
                <header>
                    <nav className="navbar sticky-top navbar-expand-md navbar-light bg-warning">

                        <a href="" className="navbar-brand ml-2"><img src="img/logo.png" width="142" /></a>

                        <button className="navbar-toggler" data-toggle="collapse" data-target="#nav-principal">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="nav-principal">
                            <ul className="navbar-nav ml-auto mx-2">
                                <li className="nav-item btn" onClick={this.collapse}> <Link to="/" className="nav-link"  >Home</Link>
                                </li>
                                <li className="nav-item btn" onClick={this.collapse}> <Link to="/about" className="nav-link" >About</Link>
                                </li>

                                <li className="nav-item btn" onClick={this.collapse}> <Link to="/plans" className="nav-link" >Plans</Link>
                                </li>
                                {isLoggedIn ? (
                                    <>
                                        <li className="nav-item btn" onClick={this.collapse}> <Link to="/dashboard" className="nav-link" >Dashboard</Link>
                                        </li>
                                        <li className="nav-item btn" onClick={this.collapse}> <Link to="/myAccount/userInfo" className="nav-link" >My Account</Link>
                                        </li>
                                        <li className="nav-item btn btn-outline-light" onClick={this.collapse}> <Link to="/" className="nav-link" onClick={this.props.handleLogOut}>Log out</Link>
                                        </li>

                                    </>
                                ) : <li className="nav-item btn btn-outline-light" onClick={this.collapse}> <Link to="/login" className="nav-link" >Log In</Link></li>
                                }



                            </ul>
                        </div>
                    </nav>
                </header>

            </>
        )
    }
}
export default Nav;

