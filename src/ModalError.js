import React from 'react';

class ModalSuccess extends React.Component {
  
  componentDidUpdate(prevProps, prevState) {//remounts the modal after updating message or showModalError state in App
              if(prevProps.showModalError != this.props.showModalError){
                console.log('remount')
              }
          }
  
    render(){
    //code to toggle modal taken from https://www.js-tutorials.com/react-js/how-to-create-modal-box-component-in-react/
    const { showModalError } = this.props
		const showHideClassName = showModalError ? 'view' : 'hide';////whenever App updates with new message or showModalError becomes true/false, it controls the display of the modal by adding a classe that will show/hide
		    //bootstrap modal templates taken from https://getbootstrap.com/docs/4.0/components/modal/
        return <>
                <div className={showHideClassName} style={{position: "fixed", zIndex: "1", left: "35%", top: "40", width: "350px"}} role="dialog">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header text-danger">
                        <h5 className="modal-title"><p>Error</p></h5>
                      </div>
                      <div className="modal-body">
                        {this.props.errorMessages.map((message,index)=><p key={index}>{message}</p>)}
                      </div>
                      <div className="modal-footer">
                        <button onClick={this.props.handleClose} type="button" data-dismiss="modal" className="btn btn-danger">Go back</button>
                      </div>
                    </div>
                  </div>
                </div>
        </>; 
        
    }
}

export default ModalSuccess;