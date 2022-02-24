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
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
            showModalSuccess: false,//controls display modal with success message
            showModalError: false,//controls display of modal with error message
            Message: [], //messages to be passed to success or error modal according to validation obtained
            displayLoginButton: false

        }
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleGoogleLogIn = this.handleGoogleLogIn.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);

    }

    componentDidMount() {
        axios.get("/api/v1.0/user/verifyAuth")
            .then(results => {
                this.setState({ isLoggedIn: true, 
                                userId: results.data._id
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
                axios.post("/api/v1.0/user/register", {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                    phoneNumber: this.state.phoneNumber.replaceAll('-', ''),//remove dashes
                    token: captchaToken
                })
                    .then(results => {
                        this.setState({ showModalSuccess: true, Message: ["ID: " + results.data._id, "Thank you for registering " + results.data.firstName + "!"], displayLoginButton: true }); //success message sends expense id to success modal and displays it

                    })
                    .catch(error => {
                        console.log(error.response.data);
                        let errorCode = error.response.data.code;

                        if (errorCode == 11000) {//email already associated with an user
                            console.log("user already existss")
                            this.setState({
                                Message: ["The email entered is already associated with an user"],
                                showModalError: true
                            });
                        } else {
                            this.setState({
                                Message: error.response.data.data,
                                showModalError: true
                            });
                        }

                    });
            })
    }

    handleLogIn() {
        let captchaToken = ''
        event.preventDefault()
        //Executes captcha after form is submitted, generates token and store it in a variable
        grecaptcha.execute('6LdmmoYaAAAAAPGLcESwa6m41uyXfKf0gQCrOtwc', { action: 'submit' })
            .then(function (token) {
                captchaToken = token;
                console.log("reCAPTCHA executed");

            })
            .then(() => {

            })
        axios.post("/api/v1.0/user/login", {
            email: this.state.email,
            password: this.state.password,
            token: captchaToken
        })
            .then(results => {
                console.log(results.data);
                this.setState({ isLoggedIn: true,
                                userId: results.data._id
                });
                console.log(this.state.isLoggedIn)

            })
            .catch(error => {
                console.log(error)
                console.log(error.response.data);

                this.setState({
                    Message: error.response.data.data,
                    showModalError: true
                });


            });



    }

    handleGoogleLogIn() {

        axios.post("/api/v1.0/oauth/google", {

        })
            .then(results => {
                console.log(results);
                console.log(results.data);


            })
            .catch(error => console.log(error));


        this.setState({ isLoggedIn: true });
    }

    handleLogOut() {
        console.log('logging out')   
        console.log(this.state.userId)        

        if (this.state.isLoggedIn == true) {
            axios.get("/api/v1.0/user/logout")
                .then(results => {
                    console.log(results.data);
                    this.setState({ isLoggedIn: false });
                    console.log(this.state.isLoggedIn)

                })
                .catch(error => {
                    console.log(error.response.data);

                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });


                });
        }

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({ showModalSuccess: false });
    }
    handleCloseError() {
        this.setState({ showModalError: false });
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
                <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} displayLoginButton={this.state.displayLoginButton} Message={this.state.Message} />
                <ModalError handleClose={this.handleCloseError} showModalError={this.state.showModalError} errorMessages={this.state.Message} />
                <Routes>
                    <Route index path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/dashboard" element={<Main isLoggedIn={this.state.isLoggedIn} userId={this.state.userId}/>} />
                    <Route path="/login" element={<Login handleLogIn={this.handleLogIn} handleGoogleLogIn={this.handleGoogleLogIn} handleChange={this.handleChange} isLoggedIn={this.state.isLoggedIn} />} />
                    <Route path="/register" element={<Register {...registerFormProps} />} />

                    <Route
                        path="*"
                        element={
                            <main style={{ padding: "1rem" }}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    />
                        />
                    </Routes>
                <Footer />

            </>
        )

    }


}

export default App;