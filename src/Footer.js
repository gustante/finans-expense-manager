import React from 'react';
import { Link, Navigate } from "react-router-dom";
function Footer() {

    return (


        <footer className="py-5 text-mutedtext-small bg-light">

            <div className="row mx-4 mx-sm-5 my-2">
                <div className="d-flex flex-column flex-sm-row">
             
                        <a className="text-decoration-none text-dark mx-1">
                        <Link className="text-decoration-none text-dark" to="/contactus">
                        Contact us 
                        </Link>
                          <span className='d-none d-sm-inline'> |</span></a>
                        <a className="text-decoration-none text-dark mx-1" href=""> Plans <span className='d-none d-sm-inline'>|</span> </a>
                        <a className="text-decoration-none text-dark mx-1" href=""> About <span className='d-none d-sm-inline'>|</span> </a>
                        <a className="text-decoration-none text-dark mx-1" href=""> Partners <span className='d-none d-sm-inline'>|</span> </a>
                        <a className="text-decoration-none text-dark mx-1" href=""> Resources <span className='d-none d-sm-inline'>|</span> </a>
                        <a className="text-decoration-none text-dark mx-1" href=""> Careers  </a>
               
                </div>

            </div>
            <div className='row mx-md-5 mx-4 my-2 mx-2 d-flex justify-content-end'>

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
            <div className="row mx-4 my-2 d-flex justify-content-end">

                    <p className="mt-3 copyright font-weight-lighter">&copy; Copyright 2019-2022 Finans</p>
     
            </div>

        </footer>


    )
}
export default Footer;


