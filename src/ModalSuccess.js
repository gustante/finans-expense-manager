import React from 'react';
import { Link } from "react-router-dom";

class ModalSuccess extends React.Component {

    componentDidUpdate(prevProps, prevState) { //remounts the modal after updating message or showModalSuccess state in Main
        if (prevProps.showModalSuccess != this.props.showModalSuccess) {
            console.log('remount')
        }
    }

    render() {
        //code to toggle modal taken from https://www.js-tutorials.com/react-js/how-to-create-modal-box-component-in-react/
        const { showModalSuccess, displayLoginButton, displayConfirmButton } = this.props
        const showHideModal = showModalSuccess ? 'view' : 'hide';//whenever Main updates with new message or showModalError becomes true/false, it controls the display of the modal by adding a classe that will show/hide
        const showLoginButton = displayLoginButton? 'view' : 'hide';
        //bootstrap modal templates taken from https://getbootstrap.com/docs/4.0/components/modal/
        const showConfirmButton = displayConfirmButton? 'view' : 'hide';

        return <>

            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-10">
                    <div className={showHideModal} style={{ position: "fixed", zIndex: "2",width:"90%", right: "30px" }} role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content shadow-lg">
                                <div className="modal-header text-success">
                                    {displayConfirmButton ? <h5 className="modal-title"><p>Account deleted succesfully</p></h5> : <h5 className="modal-title"><p>Success!</p></h5>}

                                </div>
                                <div className="modal-body">
                                    {this.props.Message.map((message, index) => <p key={index}>{message}</p>)}
                                </div>
                                {displayConfirmButton ?
                                    <div className="modal-footer"  >
                                        <Link to="/" className={showConfirmButton}>
                                            <button onClick={this.props.finalizeDeleteUser} type="button" data-dismiss="modal" className="btn btn-warning">Close</button>
                                        </Link>
                                    </div>
                                    :
                                    <div className="modal-footer">
                                        <button onClick={this.props.handleClose} type="button" data-dismiss="modal" className="btn btn-success">Close</button>
                                            <Link to="/login" className={showLoginButton}>
                                                <button onClick={this.props.handleClose} type="button" data-dismiss="modal" className="btn btn-warning">Log In</button>
                                            </Link>
                                    </div>
                                }



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;

    }
}

export default ModalSuccess;