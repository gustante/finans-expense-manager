import React from 'react';
import Budgets from "./Budgets.js"
import UserInfo from "./UserInfo.js"
import { Route, Link, Outlet } from "react-router-dom";

const navLinks = [
    {
        to: "/profile",
        label: "Profile"
    },
    {
        to: "/anh",
        label: "Anh"
    }
]

class UserAccount extends React.Component {


    /* <nav className="navbar-light col-12 col-sm-3 bg-light px-3">
                        <ul className="navbar-nav">
                            {navLinks.map(({ to, label }) => (
                                <li key={to} className="nav-item ">
                                    <a href={to} className="nav-link active">
                                        Link: {label}
                                    </a>
                                </li>
                                )
                            )}
                        </ul>
                    </nav> */
    render() {
        
        return (
            <>

                <div className="row dashboard">
                    <nav className="navbar-dark my-3 text-dark col-12 col-md-3 bg-light px-3 py-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link" to="/userAccount/userInfo">
                                    <i className="fas fa-user"></i> Account info
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/userAccount/userBudgets">
                                    <i className="fas fa-cash-register"></i> Budgets
                                </Link>
                            </li>


                        </ul>
                    </nav>
                                        
                    <Outlet />                    





                </div>
            </>
        )
    }
}
export default UserAccount;

