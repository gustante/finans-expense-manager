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

            axios.get("/api/v1.0/oauth/google/login")
                .then(results => {

                    console.log(results.data);
                    this.setState({ name: results.data });

                })
                // .catch(error => {
                //     console.log(error.response)
                //     if(error.response.data.status == 401){
                //         this.setState({displayLoginButton: true});

                //     }
                //     if(error.response.data.data != undefined){
                //         this.setState({
                //             Message: error.response.data.data,
                //             showModalError: true
                //         });
                //     } else {
                //         this.setState({
                //             Message: error.response.data,
                //             showModalError: true
                //         });
                //     }
                // });


    }

    render() {

        return (
            <>
                <h1>Hello {this.state.name}</h1>
            </>
        )
    }
}
export default Authenticated;

