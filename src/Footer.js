import React from 'react';

function Footer() {

    return (


        <footer className="py-5 text-mutedtext-small bg-light">

            <div className="row mx-5 my-2">
                <div className="d-flex flex-column">
             
                        <a className="text-decoration-none text-dark mx-1" href="">Contact Us</a>
                        <a className="text-decoration-none text-dark mx-1" href="">Plans</a>
                        <a className="text-decoration-none text-dark mx-1" href="">About</a>
                        <a className="text-decoration-none text-dark mx-1" href="">Partners</a>
                        <a className="text-decoration-none text-dark mx-1" href="">Resources</a>
                        <a className="text-decoration-none text-dark mx-1" href="">Careers</a>
               
                </div>

            </div>
            <div className='row mx-md-5 mx-5 my-2 mx-2 d-flex justify-content-end'>

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
            <div className="row mx-5 my-2">

                    <p className="mt-3 copyright font-weight-lighter ">&copy; Copyright 2019-2022 Finans</p>
     
            </div>

        </footer>


    )
}
export default Footer;


