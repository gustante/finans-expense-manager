import React from 'react';
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';

class Authenticated extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",

        }
    }

    componentDidMount() {
        console.log("redirected to authenticated")

        this.props.handleGoogleLogIn()

    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;
        return (
            <>
                {isLoggedIn ? (
                    <Navigate to="/dashboard" />
                ) : (<>
                    <h1 className='m-2'>Redirecting...</h1>
                    <div className="table-spinner mt-1 spinner">
                        <div className="spinner-border " role="status">
                            <p class=" d-block sr-only">Loading...</p>
                        </div>
                    </div>
                </>
                )
                }



            </>
        )
    }
}
export default Authenticated;

