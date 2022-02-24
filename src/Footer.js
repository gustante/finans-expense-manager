import React from 'react';

function Footer() {

    return (


        <footer className="py-5 text-muted text-center text-small bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <p>
                            <a className="text-decoration-none" href="">Contact Us</a>
                            <a className="text-decoration-none"  href="">Partners</a>
                            <a className="text-decoration-none" href="">Resources</a>
                            <a className="text-decoration-none" href="">Careers</a>
                        </p>
                    </div>
                    <div className="col-md-4 d-flex justify-content-end">
                        <a href="" className="btn btn-outline-dark">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="" className="btn btn-outline-dark ml-2">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="" className="btn btn-outline-dark ml-2">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="" className="btn btn-outline-dark ml-2">
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


