import React from 'react';
import axios from 'axios';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import { Navigate } from "react-router-dom";

class LinkAccounts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {


        }


    }

    componentDidMount() {
       
    }




    render() {
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <>
                {isLoggedIn ? (
                    <>
                        <main className="col-12 col-sm-8 my-3 my-sm-4">
                            <h3>Link your bank accounts to track your transactions</h3>
                        </main>

                    </>
                ) : <Navigate to="/login" />
                }
            </>

        )
    }
}
export default LinkAccounts;

