import React from 'react';
import axios from 'axios';

class Register extends React.Component {

    render() {
        return (
            <>

                <div className="form-register">
                    <div className="row d-flex justify-content-center">
                        <h1 className="py-5">Create new account</h1>
                        <div className="col-md-8 order-md-1 ">
                            <form onSubmit={this.props.handleRegister} >
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName">First name</label>
                                        <input type="text" name="firstName" className="form-control" id="firstName" required autoFocus onChange={this.props.handleChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName">Last name</label>
                                        <input type="text" name="lastName" className="form-control" id="lastName" required onChange={this.props.handleChange}/>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" className="form-control" id="email" placeholder="you@example.com" required onChange={this.props.handleChange}/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" minLength="6" maxLength="20" className="form-control" id="password" required onChange={this.props.handleChange} readonly="" onfocus="this.removeAttribute('readonly');"/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber">Phone number <span className="text-muted"> US or CANADIAN)</span></label>
                                    <input type="tel" name="phoneNumber" className="form-control" id="phoneNumber"                                                               onChange={this.props.handleChange} readonly="" onfocus="this.removeAttribute('readonly');"/>
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

