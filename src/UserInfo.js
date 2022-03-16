import React from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";

class UserInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            noOfExpenses: "",


        }

    }

    componentDidMount(){
        axios.get("/api/v1.0/user/noOfExpenses")
            .then(results => {
                console.log(results)
                this.setState({
                    noOfExpenses: results.data.expenses.length,
                });

            })
            .catch(error => {
                console.log(error.response.data)
            });
    }

    render() {
        const { isLoggedIn, _id, firstName, lastName, email, phoneNumber } = this.props.userInfo;

        return (
            <>
                {isLoggedIn ? (
                    <>
                        <div className="px-3 py-3 col-md-9">

                            <ul className="list-group ">

                                <li className="list-group-item "><span className="font-weight-bold">Name:</span> {firstName},{lastName}</li>
                                <li className="list-group-item"><span className="font-weight-bold">Email:</span> {email}</li>
                                <li className="list-group-item"><span className="font-weight-bold">Phone number:</span> {phoneNumber}</li>
                                <li className="list-group-item"><span className="font-weight-bold">Password:</span> ******</li>
                                <li className="list-group-item"><span className="font-weight-bold">Number of Expenses:</span> {this.state.noOfExpenses}</li>
                            </ul>
                            <div className="d-flex justify-content-center px-3 py-3">
                                <button type="button" className="btn btn-primary">Update info</button>
                            </div>
                        </div>

                    </>
                ) : <Navigate to="/login" />
                }
            </>


        )
    }
}
export default UserInfo;

