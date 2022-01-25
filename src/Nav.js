import React from 'react';
import {Link} from "react-router-dom";

class Nav extends React.Component {

    render(){
        
        return <>
        
            <header> 
                <nav className="navbar sticky-top navbar-expand-md navbar-light bg-warning">

                <a href="" className="navbar-brand ml-2"><img src="img/logo.png" width="142"/></a>

                <button className="navbar-toggler" data-toggle="collapse" data-target="#nav-principal"> 
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="nav-principal">
                    <ul className="navbar-nav ml-auto mx-2">
                        <Link to="/">
                            <button className="btn"><li className="nav-item" className=" nav-link" >Home</li></button>
                            
                        </Link>
                        <Link to="/about">
                            <button className="btn"><li className="nav-item" className=" nav-link" >About</li></button>
                            
                        </Link>
                        <Link to="/faq">
                            <button className="btn"><li className="nav-item" className=" nav-link" >F.A.Q</li></button> 
                        </Link>
                        <Link to="/plans">
                            <button className="btn"><li className="nav-item" className=" nav-link" >Plans</li></button>
                            
                        </Link>
                        <Link to="/dashboard">
                            <button className="btn"><li className="nav-item" className=" nav-link" >Dashboard</li></button>
                            
                        </Link>
                        <Link to="/login">
                            <button className="btn btn-outline-light"><li className="nav-item" className="nav-link px-2 py-1 "> Log In</li></button>
                            
                        </Link>
                        
                        
                        
                        
                        
                        
                    </ul>
                </div>
                </nav>
            </header>  
            
        </>; 
        
    }
}
export default Nav;

