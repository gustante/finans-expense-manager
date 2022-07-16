import React from 'react';
import Home from "./Home.js"
import Nav from "./Nav.js"
import FAQ from "./FAQ.js"
import About from "./About.js"
import Plans from "./Plans.js"
import Main from "./Main.js"
import Login from "./Login.js"
import Footer from "./Footer.js"
import Register from "./Register.js"
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import MyAccount from './MyAccount';
import Budgets from "./Budgets.js"
import UserInfo from "./UserInfo.js"
import ManageTypes from "./ManageTypes.js"
import Authenticated from "./Authenticated.js"
import ContactUs from "./ContactUs.js"
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phoneNumber: "",
            newFirstName: "",
            newLastName: "",
            newEmail: "",
            newPhoneNumber: "",
            oldPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            showModalSuccess: false,//controls display modal with success message
            showModalError: false,//controls display of modal with error message
            displayConfirmButton: false,//controls display of modal for confirming actions
            Message: [], //messages to be passed to success or error modal according to validation obtained
            displayLoginButton: false,
            exists: "", //controls google login,
            googleUser: false,
            contactUsTextarea: "",
        }

        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleGoogleLogIn = this.handleGoogleLogIn.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleStopEditingUser = this.handleStopEditingUser.bind(this);
        this.handleStartEditingUser = this.handleStartEditingUser.bind(this);
        this.handleSaveEditingUser = this.handleSaveEditingUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.confirmDeleteUser = this.confirmDeleteUser.bind(this);
        this.finalizeDeleteUser = this.finalizeDeleteUser.bind(this);
        this.handleSubmitContactForm = this.handleSubmitContactForm.bind(this);
    }

    componentDidMount() {
        axios.get("/api/v1.0/user/verifyAuth")
            .then(results => {
                const { _id, firstName, lastName, email, phoneNumber, googleUser } = results.data;
                this.setState({
                    isLoggedIn: true,
                    userId: _id,
                    firstName: firstName,
                    lastName: lastName,
                    password: "",
                    email: email,
                    phoneNumber: phoneNumber,
                    googleUser: googleUser

                });

            })
            .catch(error => {
                console.log(error.response.data)
            });

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
                const current = new Date();
                axios.post("/api/v1.0/user/register", {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                    phoneNumber: this.state.phoneNumber.replaceAll('-', ''),//remove dashes
                    token: captchaToken,
                    currentMonth: current.getMonth() + 1,
                    currentYear: current.getFullYear(),
                    googleUser: false
                })
                    .then(results => {
                        this.setState({ showModalSuccess: true, Message: ["ID: " + results.data._id, "Thank you for registering " + results.data.firstName + "!"], displayLoginButton: true }); //success message sends expense id to success modal and displays it

                    })
                    .catch(error => {
                        console.log(error.response)
                        console.log(error.response.data);
                        let errorCode = error.response.data.code;

                        if (errorCode == 11000) {//email already associated with an user
                            this.setState({
                                Message: ["The email entered is already associated with an user"],
                                showModalError: true
                            });
                        } else {
                            if (error.response.data.data != undefined) {
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

                        }

                    });
            })
    }



    handleLogIn() {
        if (event)
            event.preventDefault()

        console.log("executed handleLogin")
        let captchaToken = ''
        //Executes captcha after form is submitted, generates token and store it in a variable
        grecaptcha.execute('6LdmmoYaAAAAAPGLcESwa6m41uyXfKf0gQCrOtwc', { action: 'submit' })
            .then(function (token) {
                captchaToken = token;
                console.log("reCAPTCHA executed");

            })
            .then(() => {
                const current = new Date();
                axios.post("/api/v1.0/user/login", {
                    email: this.state.email,
                    password: this.state.password,
                    token: captchaToken,
                    currentMonth: current.getMonth() + 1,
                    currentYear: current.getFullYear(),
                    googleUser: this.state.googleUser

                })
                    .then(results => {
                        const { _id, firstName, lastName, email, phoneNumber, googleUser } = results.data;
                        console.log(results.data)

                        this.setState({
                            isLoggedIn: true,
                            userId: _id,
                            firstName: firstName,
                            lastName: lastName,
                            password: "",
                            email: email,
                            phoneNumber: phoneNumber,
                            googleUser: googleUser

                        });

                    })

                    .catch(error => {
                        console.log(error.response)
                        if (error.response.data.status == 401) {
                            this.setState({ displayLoginButton: true });

                        }
                        if (error.response.data.data != undefined) {
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



            })
    }

    handleGoogleLogIn() {
        console.log("execited handleGoogleLogin")
        let captchaToken = ''

        axios.get("/api/v1.0/oauth/google/login")
            .then(results => {
                console.log("user info receives from backend:")
                console.log(results.data)
                this.setState({
                    firstName: results.data.firstName,
                    lastName: results.data.lastName,
                    password: results.data.password,
                    email: results.data.email,
                    phoneNumber: results.data.phoneNumber,
                    exists: results.data.exists,
                    googleUser: results.data.googleUser
                });
            })
            .then(() => {
                console.log("this is what i have in state:")
                console.log(this.state)

                if (!this.state.exists) {//create new user if it doesn't exist
                    grecaptcha.execute('6LdmmoYaAAAAAPGLcESwa6m41uyXfKf0gQCrOtwc', { action: 'submit' })
                        .then(function (token) {
                            captchaToken = token;
                            console.log("reCAPTCHA executed");
                        })
                        .then(() => {
                            const current = new Date();
                            console.log("attempts to create user")
                            axios.post("/api/v1.0/user/register", {
                                firstName: this.state.firstName,
                                lastName: this.state.lastName,
                                email: this.state.email,
                                password: 'whatever',
                                phoneNumber: this.state.phoneNumber.replaceAll('-', ''),//remove dashes
                                token: captchaToken,
                                currentMonth: current.getMonth() + 1,
                                currentYear: current.getFullYear(),
                                googleUser: true
                            })
                                .then(results => {
                                    console.log("user created:")
                                    console.log(results.data)
                                    this.handleLogIn()
                                })
                                .catch(error => {
                                    console.log(error)
                                    console.log(error.response)
                                    console.log(error.response.data);
                                    let errorCode = error.response.data.code;

                                    if (error.response.data.data != undefined) {
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
                        })
                } else { //user user exists just log in
                    this.handleLogIn()
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
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });


    }

    handleLogOut() {
        if (this.state.isLoggedIn == true) {
            if (this.state.googleUser)
                this.handleGoogleLogOut()

            axios.get("/api/v1.0/user/logout")
                .then(results => {
                    this.setState({ isLoggedIn: false });
                })
                .catch(error => {
                    console.log(error.response)
                    if (error.response.data.status == 401) {
                        this.setState({ displayLoginButton: true });

                    }
                    if (error.response.data.data != undefined) {
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

    }

    handleGoogleLogOut() {
        axios.get("/api/v1.0/oauth/google/logout")
            .then(results => {
                console.log(results)
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
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



    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({
            showModalSuccess: false,
            displayLoginButton: false,
            displayConfirmButton: false
        });
    }
    handleCloseError() {
        this.setState({
            showModalError: false,
            displayLoginButton: false,
            displayConfirmButton: false

        });
    }

    handleStartEditingUser(expenseId) {
        //show inputs and buttons for editing
        $('#user-info input').removeClass("hide")
        $('#user-info input').addClass("view d-inline")
        if (this.state.googleUser) {
            $('[type=email]').attr('disabled', 'true');
            $('[type=password]').removeAttr('readonly');
            $('[type=password]').attr('disabled', 'true');
        }

        $('.userInfo').removeClass("view")
        $('.userInfo').addClass("hide")

        $('.editInfo').removeClass("hide")
        $('.editInfo').addClass("view")

    }

    handleStopEditingUser() {
        console.log("stop editing")

        $('#user-info input').removeClass("view d-inline")
        $('#user-info input').addClass("hide")

        $('.userInfo').removeClass("hide")
        $('.userInfo').addClass("view")

        $('.editInfo').removeClass("view")
        $('.editInfo').addClass("hide")

        this.setState({
            oldPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            newFirstName: "",
            newLastName: "",
            newPhoneNumber: "",
            newEmail: "",
        });
    }

    handleSaveEditingUser(e) {
        e.preventDefault()
        console.log("save editing")
        console.log("send to backend: ")
        console.log(this.state)
        axios.put('/api/v1.0/user/updateUser', {
            firstName: this.state.newFirstName,
            lastName: this.state.newLastName,
            email: this.state.newEmail,
            phoneNumber: this.state.newPhoneNumber.replaceAll('-', ''),
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            repeatNewPassword: this.state.repeatNewPassword
        })
            .then(results => {

                console.log(results.data)
                this.setState({
                    firstName: results.data.firstName,
                    lastName: results.data.lastName,
                    email: results.data.email,
                    phoneNumber: results.data.phoneNumber
                });
                this.handleStopEditingUser()

            })
            .catch(error => {
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
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

    confirmDeleteUser(e) {
        e.preventDefault()
        console.log("confirm before delete user")

        this.setState({
            Message: ["Are you sure you want to delete your account and all your expenses?"],
            showModalError: true,
            displayConfirmButton: true
        })
    }

    finalizeDeleteUser(e) {
        e.preventDefault()
        this.handleCloseSuccess()
        this.setState({
            isLoggedIn: false
        })

    }

    handleDeleteUser(e) {
        e.preventDefault()
        console.log("deleting user")
        this.handleCloseError()
        axios.delete('/api/v1.0/user/deleteUser', {
            userId: this.state.userId,
            email: this.state.email
        })
            .then(results => {

                console.log(results.data)
                console.log('user was deleted on backend')

                this.setState({ showModalSuccess: true, Message: ["Sorry to see you go :( ", "Thank you for using Finans :)"], displayConfirmButton: true });

            })
            .catch(error => {
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
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

    handleSubmitContactForm(e) {
        e.preventDefault()
        console.log("submitting contact form")
        console.log(this.state)
        axios.post('/api/v1.0/submitContactForm', {
            firstName: this.state.firstName,
            email: this.state.email,
            contactUsTextarea: this.state.contactUsTextarea
        })
            .then(results => {

                console.log(results.data)
                this.setState({
                    showModalSuccess: true, Message: [`Thank you for your feedback, ${this.state.firstName}! \n We'll get back to you soon!`],
                    firstName: "",
                    email: "",
                    contactUsTextarea: ""

                });
                $('input').val('');
                $('textarea').val('');

            }
            )
            .catch(error => {
                console.log(error)
                console.log(error.response)

                if (error.response.data.data != undefined) {
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
            })
    }

    render() {

        let registerFormProps = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            phoneNumber: this.state.phoneNumber,
            handleChange: this.handleChange,
            handleRegister: this.handleRegister
        }

        return (
            <>
                <Nav isLoggedIn={this.state.isLoggedIn} handleLogOut={this.handleLogOut} />
                <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} displayLoginButton={this.state.displayLoginButton} Message={this.state.Message} displayConfirmButton={this.state.displayConfirmButton} finalizeDeleteUser={this.finalizeDeleteUser} />
                <ModalError handleClose={this.handleCloseError} showModalError={this.state.showModalError} errorMessages={this.state.Message} displayConfirmButton={this.state.displayConfirmButton} handleDelete={this.handleDeleteUser} />

                <Routes>
                    <Route index path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/dashboard" element={<Main isLoggedIn={this.state.isLoggedIn} userId={this.state.userId} />} />
                    <Route path="/login" element={<Login handleLogIn={this.handleLogIn} handleGoogleLogIn={this.handleGoogleLogIn} handleChange={this.handleChange} isLoggedIn={this.state.isLoggedIn} />} />
                    <Route path="/register" element={<Register {...registerFormProps} />} />
                    <Route path="/myAccount" element={<MyAccount />}>
                        <Route path="userInfo" element={<UserInfo userInfo={this.state} handleChange={this.handleChange} handleStartEditingUser={this.handleStartEditingUser} handleStopEditingUser={this.handleStopEditingUser} handleSaveEditingUser={this.handleSaveEditingUser} confirmDeleteUser={this.confirmDeleteUser} handleDeleteUser={this.handleDeleteUser} />} />
                        <Route path="userBudgets" element={<Budgets isLoggedIn={this.state.isLoggedIn} />} />
                        <Route path="manageTypes" element={<ManageTypes isLoggedIn={this.state.isLoggedIn} />} />
                    </Route>
                    <Route path="/authenticated" element={<Authenticated handleGoogleLogIn={this.handleGoogleLogIn} isLoggedIn={this.state.isLoggedIn} />} />
                    <Route path="/contactus" element={<ContactUs handleSubmitContactForm={this.handleSubmitContactForm} handleChange={this.handleChange} />} />


                    <Route
                        path="*"
                        element={
                            <main style={{ padding: "1rem" }}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    />

                </Routes>
                <Footer />

            </>
        )

    }


}

export default App;