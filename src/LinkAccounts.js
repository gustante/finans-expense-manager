import React from 'react';
import axios from 'axios';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import { Navigate } from "react-router-dom";

class LinkAccounts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            linkToken: "",

        }
        this.getLinkToken = this.getLinkToken.bind(this);

    }

    componentDidMount() {
       
    }

    getLinkToken(){
        console.log("step 1: request a link token from server")
        axios.post('/api/v1.0/plaid/createLinkToken')
            .then(results => {
                console.log(results.data)
                console.log("received link token from server")
                this.setState({
                    linkToken: results.data.linkToken
                })
            }
            )
        
    }




    render() {
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <>
                {isLoggedIn ? (
                    <>
                        <main className="col-12 col-sm-8 my-3 my-sm-4">
                            <h3>Link your bank accounts to track your transactions</h3>
                            <button type='button' className="btn btn-success" onClick={this.getLinkToken}>Connect</button>
                        </main>

                    </>
                ) : <Navigate to="/login" />
                }
            </>

        )
    }
}
export default LinkAccounts;

