import React from 'react';
const axios = require('axios');

class ResetPassword extends React.Component {



    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    removeReadonly() {
        console.log("removing ")
        $("input[readonly]").removeAttr("readonly")
    }

    render() {
        return (
            <>
                <div className='mx-4 mt-4 mb-5'>

                    <form className="form-signin" onSubmit={this.props.handleSubmitContactForm}>
                        <div className="text-center mb-4">
                            <h1 className="my-5 ">Contact us</h1>
                            <p>Questions? Comments? Concerns? Suggestions? </p>
                            <p>Leave us a message below</p>
                        </div>

                        <div className="form-label-group my-3">
                            <input type="text" name="firstName" className="form-control" placeholder="Email address" required onChange={this.props.handleChange} />
                            <label htmlFor="firstName">Name</label>
                        </div>

                        <div className="form-label-group my-3">
                            <input type="email" name="email" className="form-control" placeholder="Email address" required onChange={this.props.handleChange} />
                            <label htmlFor="email">Email address</label>
                        </div>

                        <div className="form-group my-3">
                            <textarea className="form-control" id="textarea" name='contactUsTextarea' rows="5" required onChange={this.props.handleChange} placeholder="Message"></textarea>
                            
                        </div>

                        <button className="btn btn-primary btn btn-block" type="submit">Submit</button>

                    </form>


                </div>




            </>
        )
    }
}
export default ResetPassword;

