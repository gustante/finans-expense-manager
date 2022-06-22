import React from 'react';
import axios from 'axios';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import { Navigate } from "react-router-dom";

class UserInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            noOfExpenses: "",
            showModalSuccess: false,
            showModalError: false,
            Message: [],
            displayLoginButton: false


        }
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);

    }

    removeReadonly(){
        console.log("removing ")
        $("input[readonly]").removeAttr("readonly")
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
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({ showModalSuccess: false,
                        displayLoginButton: false
        });
    }
    handleCloseError() {
        this.setState({ showModalError: false,
                    displayLoginButton: false
        });
    }

    render() {
        const { isLoggedIn, _id, firstName, lastName, email, phoneNumber } = this.props.userInfo;

        return (
            <>
                {isLoggedIn ? (
                    <div className='col-12 my-3 col-sm-8'>

                        <form className="px-1 py-3 col-md-9" onSubmit={this.props.handleSaveEditingUser}>
                        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} displayLoginButton={this.state.displayLoginButton} Message={this.state.Message} />
                        <ModalError handleClose={this.handleCloseError} displayLoginButton={this.state.displayLoginButton} showModalError={this.state.showModalError} errorMessages={this.state.Message} />

                            <ul id="user-info" className="list-group">

                                <li className="list-group-item">
                                    <input type="text" name="firstName" className="hide form-control col-12 m-1" value={this.props.userInfo.firstName} placeholder="First Name" onChange={this.props.handleChange}/>
                                    <input type="text" name="lastName" className="hide form-control col-12 m-1" value={this.props.userInfo.lastName} placeholder="Last Name" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span className="font-weight-bold">Name:</span> {firstName} {lastName}
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <input type="email" name="email" className="hide form-control col-12 m-1" value={this.props.userInfo.email} placeholder="abc@g.com" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span  className="font-weight-bold">Email:</span> {email}
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <input type="text" name="phoneNumber" className="hide form-control col-12 m-1" value={this.props.userInfo.phoneNumber} pattern="[0-9]{3}[0-9]{3}[0-9]{4}" placeholder="10 digits" onChange={this.props.handleChange}/>

                                    <div className="view userInfo">
                                        <span className="font-weight-bold">Phone number:</span> {phoneNumber}
                                    </div>
                                </li>

                                <li className="list-group-item">
                                    <input type="password" name="oldPassword" className="hide form-control col-12 m-1" value={this.props.userInfo.oldPassword} placeholder="Old password" onChange={this.props.handleChange} readonly="" onFocus={this.removeReadonly}/>
                                    <input type="password" name="newPassword" className="hide form-control col-12 m-1 " value={this.props.userInfo.newPassword} placeholder="New Password" onChange={this.props.handleChange} readonly="" onFocus={this.removeReadonly}/>
                                    <input type="password" name="repeatNewPassword" className="hide form-control col-12 m-1" value={this.props.userInfo.repeatNewPassword} placeholder="Repeat new password" onChange={this.props.handleChange} readonly="" onFocus={this.removeReadonly}/>

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
                                <button type="submit" className="btn btn-primary hide editInfo m-1" >Save</button>
                                <button type="button" className="btn btn-secondary hide editInfo m-1" onClick={this.props.handleStopEditingUser}>Cancel</button>
                                <button type="button" className="btn btn-danger editInfo m-1" onClick={this.props.confirmDeleteUser}>Delete account</button>
                            </div>
                        </form>

                    </div>
                ) : <Navigate to="/login" />
                }
            </>


        )
    }
}
export default UserInfo;

