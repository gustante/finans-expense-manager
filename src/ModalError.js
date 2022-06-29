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
        const { showModalError, displayLoginButton, displayConfirmButton, displayDeleteJustOneButton } = this.props

        //whenever Main updates with new message or showModalError becomes true/false, it controls the display of the modal by adding a classe that will show/hide the modal
        const showHideModal = showModalError ? 'view' : 'hide';
        const showLoginButton = displayLoginButton? 'view' : 'hide';
        const showConfirmButton = displayConfirmButton? 'view' : 'hide';
        const showDeleteJustOneButton = displayDeleteJustOneButton? 'view' : 'hide';

        return <>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-10">
                    <div className={showHideModal} style={{ position: "absolute", zIndex: "2",width:"100%" }} role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content shadow-lg">
                                <div className="modal-header text-danger">

                                    {displayConfirmButton ? <h5 className="modal-title"><p>Confirm before proceeding</p></h5> : <h5 className="modal-title"><p>Error</p></h5>}

                                </div>
                                <div className="modal-body">
                                    {this.props.errorMessages.map((message, index) => <p key={index}>{message}</p>)}
                                </div>
                                <div className="modal-footer">
                                    <button onClick={this.props.handleClose} type="button" data-dismiss="modal" className="btn btn-secondary">Close</button>

                                    <div className={showLoginButton} >
                                        <button onClick={this.props.handleClose} onClick={this.refresh} type="button" data-dismiss="modal" className="btn btn-warning">Log in</button>
                                    </div>
                                    <div className={showConfirmButton} >
                                        <button onClick={this.props.handleDelete} type="button" data-dismiss="modal" className="btn btn-danger">Confirm deletion</button>
                                    </div>
                                    <div className={showDeleteJustOneButton} >
                                        <button onClick={this.props.handleDeleteOne} type="button" data-dismiss="modal" className="btn btn-warning">No, delete only this one</button>
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