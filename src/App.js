import React from 'react';
import Home from "./Home.js"
import Nav from "./Nav.js"
import FAQ from "./FAQ.js"
import About from "./About.js"
import Plans from "./Plans.js"
import Main from "./Main.js"
import Login from "./Login.js"
import Footer from "./Footer.js"


import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

class App extends React.Component {

    render(){
        
        return <>
        <Router>
            <Nav />
            <Routes>
                <Route path="/" exact element={<Home/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/plans" element={<Plans/>} />
                <Route path="/faq" element={<FAQ/>} />
                <Route path="/dashboard" element={<Main/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
            <Footer />
        </Router>
            
        </>; 
        
    }
}

export default App;