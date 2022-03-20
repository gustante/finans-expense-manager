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

                            <ul id="user-info" className="list-group">

                                <li className="list-group-item">
                                    <input type="text" name="firstName" className="hide form-control col-5 m-1" value={this.props.userInfo.firstName} placeholder="First Name" onChange={this.props.handleChange}/>
                                    <input type="text" name="lastName" className="hide form-control col-5 m-1" value={this.props.userInfo.lastName} placeholder="Last Name" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span className="font-weight-bold">Name:</span> {firstName} {lastName}
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <input type="email" name="email" className="hide form-control col-5 m-1" value={this.props.userInfo.email} placeholder="abc@g.com" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span className="font-weight-bold">Email:</span> {email}
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <input type="text" name="phoneNumber" className="hide form-control col-5 m-1" value={this.props.userInfo.phoneNumber} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="xxx-xxx-xxxx" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span className="font-weight-bold">Phone number:</span> {phoneNumber}
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <input type="text" name="oldPassword" className="hide form-control col-3 m-1" value={this.props.userInfo.oldPassword} placeholder="Old password" onChange={this.props.handleChange}/>
                                    <input type="text" name="newPassword" className="hide form-control col-3 m-1 " value={this.props.userInfo.newPassword} placeholder="New Password" onChange={this.props.handleChange}/>
                                    <input type="text" name="repeatNewPassword" className="hide form-control col-4 m-1" value={this.props.userInfo.repeatNewPassword} placeholder="Repeat new password" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span className="font-weight-bold">Password:</span> ******
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <div className="view">
                                        <span className="font-weight-bold">Number of Expenses:</span> {this.state.noOfExpenses}
                                    </div>
                                </li>
                            </ul>
                            <div className="d-flex justify-content-center px-3 py-3">
                                <button type="button" className="btn btn-primary m-1 userInfo" onClick={this.props.handleStartEditingUser}>Update info</button>
                                <button type="button" className="btn btn-primary hide editInfo m-1" onClick={this.props.handleSaveEditingUser}>Save</button>
                                <button type="button" className="btn btn-secondary hide editInfo m-1" onClick={this.props.handleStopEditingUser}>Cancel</button>
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

