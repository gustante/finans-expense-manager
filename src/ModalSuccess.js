import React from 'react';

class ModalSuccess extends React.Component {

    componentDidUpdate(prevProps, prevState) { //remounts the modal after updating message or showModalSuccess state in Main
        if (prevProps.showModalSuccess != this.props.showModalSuccess) {
            console.log('remount')
        }
    }

    render() {
        //code to toggle modal taken from https://www.js-tutorials.com/react-js/how-to-create-modal-box-component-in-react/
        const { showModalSuccess } = this.props
        const showHideClassName = showModalSuccess ? 'view' : 'hide';//whenever Main updates with new message or showModalError becomes true/false, it controls the display of the modal by adding a classe that will show/hide
        //bootstrap modal templates taken from https://getbootstrap.com/docs/4.0/components/modal/
        return <>

            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-10">
                    <div className={showHideClassName} style={{ position: "absolute", zIndex: "2",width:"100%" }} role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header text-success">
                                    <h5 className="modal-title"><p>Success!</p></h5>
                                </div>
                                <div className="modal-body">
                                    <p>{this.props.Message[1]} </p>
                                    <p>{this.props.Message[0]}</p>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={this.props.handleClose} type="button" data-dismiss="modal" className="btn btn-success">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;

    }
}

export default ModalSuccess;