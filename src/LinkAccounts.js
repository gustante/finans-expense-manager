import React from 'react';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import axios from 'axios';
import { Link, Navigate } from "react-router-dom";

class LinkAccounts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            linkToken: "",
            transactions: [],
            accounts: [],
            showModalSuccess: false,
            showModalError: false,
            displayLoginButton: false,
            Message: [],
            displayLoginButton: false

        }
        this.getLinkToken = this.getLinkToken.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.syncTransactions = this.syncTransactions.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);

    }

    componentDidMount() {
        this.getLinkToken()
        axios.get('/api/v1.0/plaid/getItems')
            .then(results => {

                console.log("received items from server")
                if (results.data && results.data.length > 0) {
                    this.setState({
                        accounts: results.data
                    })
                }

                console.log(results.data)

            }
            )
            .catch(error => {
                console.log(error)
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else if (error.response.data != undefined) {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: ["Something went wrong", error],
                        showModalError: true
                    });
                }
            });
    }

    getLinkToken() {

        console.log("step 1: request a link token from server")
        axios.post('/api/v1.0/plaid/createLinkToken')
            .then(results => {
                console.log(results.data)
                console.log("received link token from server")
                this.setState({
                    linkToken: results.data.link_token
                })

                $('#connect').removeClass("d-none")

                if (results.data.hasAccessToken) {
                    console.log("has access token")
                    this.getTransactions()
                }
            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else if (error.response.data != undefined) {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: ["Something went wrong", error],
                        showModalError: true
                    });
                }
            });


    }

    getAccessToken() {
        console.log("step 2: exchange public token for access token")
        console.log("token is " + this.state.linkToken)
        const handler = Plaid.create({
            token: this.state.linkToken,
            onSuccess: (token, metadata) => {
                axios.post('/api/v1.0/plaid/exchangePublicToken', {
                    public_token: token,
                    accounts: metadata.accounts,
                    institution: metadata.institution,
                    link_session_id: metadata.link_session_id,

                }).then(results => {
                    console.log(results.data)
                    this.getTransactions()
                    console.log("received access token from server")

                }).catch(error => {
                    console.log(error.response)
                    console.log(error.response.data);
                    let errorCode = error.response.data.code;


                    if (error.response.data.data != undefined) {
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    } else if (error.response.data != undefined) {
                        this.setState({
                            Message: error.response.data,
                            showModalError: true
                        });
                    } else {
                        this.setState({
                            Message: ["Something went wrong", error],
                            showModalError: true
                        });
                    }



                });

            },
            onLoad: () => { },
            onExit: (err, metadata) => {
                if (err != null) {
                    // The user encountered a Plaid API error prior to exiting.
                    console.log('stopping')
                }
                else if (metadata.exit_type === 'logout') {
                    // The user exited the Link flow without linking.
                    console.log('stopping')
                }
                else {
                    this.setState({
                        Message: ["Something went wrong", "Please refresh the page and check that you are logged in", err],
                        showModalError: true
                    });
                }
            },
            onEvent: (eventName, metadata) => { },
        });
        handler.open()

    }

    getTransactions() {
        console.log("getting transactions")
        axios.get('/api/v1.0/plaid/getTransactions')
            .then(results => {
                console.log(results.data)
                console.log("received transactions from server")
                this.setState({
                    transactions: results.data
                })
            }
            )
            .catch(err => {
                console.log(err)
            })

    }

    syncTransactions() {
        axios.post('/api/v1.0/plaid/syncTransactions')
            .then(results => {
                console.log(results.data)
                console.log("syncronized transactions in backend server")

            }
            )
            .catch(err => {
                console.log(err)
            })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({
            showModalSuccess: false,
            displayLoginButton: false
        });
    }
    handleCloseError() {
        this.setState({
            showModalError: false,
            displayLoginButton: false
        });
    }




    render() {
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <>
                {isLoggedIn ? (
                    <>
                        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} Message={this.state.Message} />
                        <ModalError handleClose={this.handleCloseError} displayLoginButton={this.state.displayLoginButton} showModalError={this.state.showModalError} errorMessages={this.state.Message} />

                        <main className="col-12 col-sm-8 my-3 my-sm-4">

                            {this.state.accounts.length > 0 ? (<>
                                <h4>Transactions for current month</h4>
                                <p>From your linked accounts:</p>
                                {this.state.accounts.map(account => (<span className="btn btn-warning m-2">{account} </span>))}

                                <table className="table table-responsive-sm" >
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.transactions && this.state.transactions.map(transaction => (
                                            <tr key={transaction.transaction_id}>
                                                <td>{transaction.date}</td>
                                                <td>{transaction.category.map(category => (<span>{category}, </span>))}</td>
                                                <td>{transaction.name}</td>
                                                <td>{transaction.amount}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table></>) : (<></>)}

                            <button type='button' id="connect" className="btn d-none btn-success my-2" onClick={this.getAccessToken}>Connect an account</button>
                            <button type='button' className="btn btn-primary my-2 ml-3" onClick={this.syncTransactions}>Sync transactions</button>
                        </main>
                    </>
                ) : <Navigate to="/login" />
                }
            </>

        )
    }
}
export default LinkAccounts;

