import React from 'react';

function Footer() {

    return(
        
        
        <footer className="py-5 text-muted text-center text-small bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <p>
                        <a href="">Contact Us</a>
                        <a href="">Partners</a>
                        <a href="">Resources</a>
                        <a href="">Careers</a>
                        </p>
                    </div>
                    <div className="col-md-4 d-flex justify-content-end text-decoration-none">
                        <a href="" className="btn btn-outline-dark">
                        <i className="fab fa-facebook"></i>
                        </a>
                        <a href="" className="btn btn-outline-dark ml-2 text-decoration-none">
                        <i className="fab fa-twitter"></i>
                        </a>
                        <a href="" className="btn btn-outline-dark ml-2 text-decoration-none">
                        <i className="fab fa-instagram"></i>
                        </a>
                        <a href="" className="btn btn-outline-dark ml-2 text-decoration-none">
                        <i className="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p className="mt-3 copyright font-weight-lighter text-center">&copy; Copyright 2019-2022 Finans</p> 
                    </div>
                </div>
            </div>
            </footer>

        
    )
}
export default Footer;


    