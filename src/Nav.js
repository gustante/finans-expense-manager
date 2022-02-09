import React from 'react';
import {Link} from "react-router-dom";

function Nav() {

    return(

            <header> 
                <nav className="navbar sticky-top navbar-expand-md navbar-light bg-warning">

                <a href="" className="navbar-brand ml-2"><img src="img/logo.png" width="142"/></a>

                <button className="navbar-toggler" data-toggle="collapse" data-target="#nav-principal"> 
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="nav-principal">
                    <ul className="navbar-nav ml-auto mx-2">
                        <Link to="/" className="btn">
                        <li className="nav-item" className=" nav-link" >Home</li>
                            
                        </Link>
                        <Link to="/about" className="btn">
                            <li className="nav-item" className=" nav-link" >About</li>
                            
                        </Link>
                        <Link to="/faq" className="btn">
                            <li className="nav-item" className=" nav-link" >F.A.Q</li>
                        </Link>
                        <Link to="/plans" className="btn">
                            <li className="nav-item" className=" nav-link" >Plans</li>
                            
                        </Link>
                        <Link to="/dashboard" className="btn">
                            <li className="nav-item" className=" nav-link" >Dashboard</li>
                            
                        </Link>
                        <Link to="/login" className="btn btn-outline-light">
                            <li className="nav-item" className="nav-link px-2 py-1 "> Log In</li>
                            
                        </Link>
    
                    </ul>
                </div>
                </nav>
            </header>  
            
                 
    )
}
export default Nav;
