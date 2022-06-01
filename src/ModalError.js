import React from 'react';

class ModalError extends React.Component {

    constructor(props) {
        super(props);

            this.refresh = this.refresh.bind(this);
    }

    refresh(){
            window.location.reload(true);
    }


    render() {
        const { showModalError, displayLoginButton, displayConfirmButton } = this.props
        const showHideModal = showModalError ? 'view' : 'hide';//whenever Main updates with new message or showModalError becomes true/false, it controls the display of the modal by adding a classe that will show/hide
        const showLoginButton = displayLoginButton? 'view' : 'hide';
        const showConfirmButton = displayConfirmButton? 'view' : 'hide';

        return <>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-10">
                    <div className={showHideModal} style={{ position: "absolute", zIndex: "2",width:"100%" }} role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header text-danger">

                                    {displayConfirmButton ? <h5 className="modal-title"><p>Confirm before proceeding</p></h5> : <h5 className="modal-title"><p>Error</p></h5>}

                                </div>
                                <div className="modal-body">
                                    {this.props.errorMessages.map((message, index) => <p key={index}>{message}</p>)}
                                </div>
                                <div className="modal-footer">
                                    <button onClick={this.props.handleClose} type="button" data-dismiss="modal" className="btn btn-danger">Close</button>

                                    <div className={showLoginButton} >
                                        <button onClick={this.props.handleClose} onClick={this.refresh} type="button" data-dismiss="modal" className="btn btn-warning">Log in</button>
                                    </div>
                                    <div className={showConfirmButton} >
                                        <button onClick={this.props.handleDeleteUser} type="button" data-dismiss="modal" className="btn btn-warning">Confirm deletion</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>;

    }
}

export default ModalError;