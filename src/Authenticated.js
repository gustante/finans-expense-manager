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
                    <Navigate to="/dashboard"/>
                ) : (<>
                    <h1>Loading...</h1>
                </>
                    )
                }



            </>
        )
    }
}
export default Authenticated;

