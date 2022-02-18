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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: true,

        }
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        
    }

    handleLogOut() {
        this.setState({ isLoggedIn: false });
    }

    handleLogIn() {

        axios.get("/api/v1.0/oauth/google/")
            .then(results => {  
                console.log(results);         
                console.log(results.data);
                

            })
            .catch(error => console.log(error));

        
        this.setState({ isLoggedIn: true });
    }



    render() {

        return (
            <>
                <Nav isLoggedIn={this.state.isLoggedIn} handleLogOut={this.handleLogOut}/>
                <Routes>
                    <Route index path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/dashboard" element={<Main />} />
                    <Route path="/login" element={<Login handleLogIn={this.handleLogIn} />} />
                    <Route path="/register" element={<Register/>} />
                    
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