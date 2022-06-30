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
        const { showModalError, displayLoginButton, displayConfirmButton, displayDeleteJustOneButton, displayEditJustOneButton } = this.props

        //whenever Main updates with new message or showModalError becomes true/false, it controls the display of the modal by adding a classe that will show/hide the modal
        const showHideModal = showModalError ? 'view' : 'hide';
        const showLoginButton = displayLoginButton? 'view' : 'hide';
        const showConfirmButton = displayConfirmButton? 'view' : 'hide';
        const showDeleteJustOneButton = displayDeleteJustOneButton? 'view' : 'hide';
        const showEditJustOneButton = displayEditJustOneButton? 'view' : 'hide';

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
                                        <button onClick={this.refresh} type="button" data-dismiss="modal" className="btn btn-warning">Log in</button>
                                    </div>
                                    <div className={showConfirmButton} >
                                        <button onClick={this.props.handleDelete} type="button" data-dismiss="modal" className="btn btn-danger">Confirm </button>
                                    </div>
                                    <div className={showDeleteJustOneButton} >
                                        <button onClick={this.props.handleDeleteAllRecurring} type="button" data-dismiss="modal" className="btn btn-danger">Delete all </button>
                                    </div>
                                    <div className={showDeleteJustOneButton} >
                                        <button onClick={this.props.handleDeleteOne} type="button" data-dismiss="modal" className="btn btn-warning">Delete only this one</button>
                                    </div>
                                    <div className={showEditJustOneButton} >
                                        <button onClick={this.props.handleEditAllRecurring} type="button" data-dismiss="modal" className="btn btn-danger">Edit all</button>
                                    </div>
                                    <div className={showEditJustOneButton} >
                                        <button onClick={this.props.handleEditJustOne} type="button" data-dismiss="modal" className="btn btn-warning">Edit only this one</button>
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