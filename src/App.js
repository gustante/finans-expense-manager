import React from 'react';
import Home from "./Home.js"
import Nav from "./Nav.js"
import FAQ from "./FAQ.js"
import About from "./About.js"
import Plans from "./Plans.js"
import Main from "./Main.js"
import Login from "./Login.js"
import Footer from "./Footer.js"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: true,

        }
        this.handleLogOut = this.handleLogOut.bind(this);

    }

    handleLogOut() {
        this.setState({ isLoggedIn: false });
    }


    render() {

        return (
            <>
                <Nav isLoggedIn={this.state.isLoggedIn} handleLogOut={this.handleLogOut} />
                <Routes>
                    <Route index path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/plans" element={<Plans />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/dashboard" element={<Main />} />
                    <Route path="/login" element={<Login />} />
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