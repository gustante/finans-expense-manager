import React from 'react';
import { Route, Link, Outlet, Navigate } from "react-router-dom";

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

class MyAccount extends React.Component {


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

                <div className="row mx-2 mx-md-5">
                    <nav className="navbar-dark my-3 text-dark col-12 col-sm-3 px-1 py-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link" to="/myAccount/userInfo">
                                    <i className="fas fa-user"></i> Account info
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/myAccount/userBudgets">
                                    <i className="fas fa-cash-register"></i> Budgets
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/myAccount/manageTypes">
                                    <i className="fas fa-cog"></i> Manage Types
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
export default MyAccount;

