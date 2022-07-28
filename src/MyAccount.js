import React from 'react';
import { Route, Link, Outlet, Navigate } from "react-router-dom";

class MyAccount extends React.Component {

    render() {

        return (
            <>

                <div className="row mx-2 mx-md-5">
                    <nav className="navbar-dark my-3 text-dark col-12 col-sm-3 px-1 py-3">
                        <ul className="nav flex-column ml-md-5">
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
                            <li className="nav-item">
                                <Link className="nav-link" to="/myAccount/linkAccounts">
                                <i className="fas fa-university"></i> Link Accounts
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

