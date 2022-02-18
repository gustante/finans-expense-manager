import React from 'react';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import axios from 'axios';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isRegistered: false,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phoneNumber: ""


        }
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleRegister(e) {
        let captchaToken = ''
        event.preventDefault()
        //Executes captcha after form is submitted, generates token and store it in a variable
        grecaptcha.execute('6LdmmoYaAAAAAPGLcESwa6m41uyXfKf0gQCrOtwc', { action: 'submit' })
            .then(function (token) {
                captchaToken = token;
                console.log("reCAPTCHA executed");

            })
            .then(() => {                
                axios.post("/api/v1.0/user", {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                    phoneNumber: this.state.phoneNumber.replaceAll('-', ''),//remove dashes
                    token: captchaToken
                })
                    .then(results => {
                        console.log(results)
                        console.log(results.data)


                    })
                    .catch(error => {
                        console.log("user already existes")
                        console.log(error.response.data)//all the error messages!

                    });
            })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }



    render() {
        return (
            <>
                <div className="form-signin">
                    <div className="py-5">
                        <h2>Create new account</h2>
                    </div>

                    <div className="row">
                        <div className="col-md-8 order-md-1">
                            <form className="needs-validation" onSubmit={this.handleRegister} >
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName">First name</label>
                                        <input type="text" name="firstName" className="form-control" id="firstName" required value={this.state.firstName} onChange={this.handleChange} />
                                        <div className="invalid-feedback">
                                            Valid first name is required.
                            </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName">Last name</label>
                                        <input type="text" name="lastName" className="form-control" id="lastName" required onChange={this.handleChange}/>
                                        <div className="invalid-feedback">
                                            Valid last name is required.
                            </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" className="form-control" id="email" placeholder="you@example.com" required onChange={this.handleChange}/>
                                    <div className="invalid-feedback">
                                        Please enter a valid email.
                        </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" minLength="6" maxLength="20" className="form-control" id="password" required onChange={this.handleChange}/>
                                    <div className="invalid-feedback">
                                        Please a valid password.
                        </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber">Phone number <span className="text-muted">(Optional. US or CANADIAN)</span></label>
                                    <input type="tel" name="phoneNumber" className="form-control" id="phoneNumber" pattern="^\d{3}-\d{3}-\d{4}$" placeholder="xxx-xxx-xxxx" onChange={this.handleChange}/>
                                </div>
                                <button className="btn btn-primary btn-lg btn-block" type="submit">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Register;

