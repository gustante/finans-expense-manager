import React from 'react';

import axios from 'axios';
import { Link, Navigate } from "react-router-dom";

class LinkAccounts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            linkToken: "",
            transactions: [],

        }
        this.getLinkToken = this.getLinkToken.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getTransactions = this.getTransactions.bind(this);
        this.syncTransactions = this.syncTransactions.bind(this);

    }

    componentDidMount() {
        this.getLinkToken()
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

                if (results.data.hasAccessToken) {
                    console.log("has access token")
                    this.getTransactions()
                }
            }
            )

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

                }).catch(err => {
                    console.log(err)
                })

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
                    console.log(err)
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




    render() {
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <>
                {isLoggedIn ? (
                    <>
                       

                        <main className="col-12 col-sm-8 my-3 my-sm-4">
                            <h4>Transactions for current month</h4>
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
                            </table>
                            <button type='button' className="btn btn-success my-2" onClick={this.getAccessToken}>Connect an account</button>
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

