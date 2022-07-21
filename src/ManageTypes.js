import React from 'react';
import axios from 'axios';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import { Navigate } from "react-router-dom";

class ManageTypes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expenses: [],
            types: [],
            newName: "",
            newBudget: "",
            showModalSuccess: false,
            showModalError: false,
            Message: [],
            displayLoginButton: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleStopEditingType = this.handleStopEditingType.bind(this);
        this.handleStartEditingType = this.handleStartEditingType.bind(this);
        this.handleSaveEditingType = this.handleSaveEditingType.bind(this);

    }
    componentDidMount(){
        axios.get("/api/v1.0/expense/all")
                .then(results => {
                    let arrayOfExpenses = results.data
                    this.setState({ expenses: arrayOfExpenses });
                    console.log(results.data)

                })
                .catch(error => {
                    console.log(error.response)
                    if(error.response.data.status == 401){
                        this.setState({displayLoginButton: true});

                    }
                    if(error.response.data.data != undefined){
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    } else if(error.response.data != undefined) {
                        this.setState({
                            Message: error.response.data,
                            showModalError: true
                        });
                    } else {
                        this.setState({
                            Message: ["Something went wrong", error],
                            showModalError: true
                        });
                    }
                });

        axios.get("/api/v1.0/type/all")

                .then(results => {
                    let arrayOfTypes = results.data

                    this.setState({ types: arrayOfTypes });

                })
                .catch(error => {
                    console.log(error.response)
                    if(error.response.data.status == 401){
                        this.setState({displayLoginButton: true});
    
                    }
                    if(error.response.data.data != undefined){
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    } else if(error.response.data != undefined) {
                        this.setState({
                            Message: error.response.data,
                            showModalError: true
                        });
                    } else {
                        this.setState({
                            Message: ["Something went wrong", error],
                            showModalError: true
                        });
                    }
                });
    }

    handleStartEditingType(typeId) {
        event.preventDefault()
        $(`.${typeId} input`).removeClass("hide")
        $(`.${typeId} input`).addClass("view")

        $(`.${typeId} div`).removeClass("view")
        $(`.${typeId} div`).addClass("hide")

        $(`.${typeId} .defaultButtons`).removeClass("view")
        $(`.${typeId} .defaultButtons`).addClass("hide")

        $(`.${typeId} .editButtons`).removeClass("hide")
        $(`.${typeId} .editButtons`).addClass("view")

    }

    handleStopEditingType(typeId) {
        $(`.${typeId} input`).removeClass("view")
        $(`.${typeId} input`).addClass("hide")

        $(`.${typeId} div`).removeClass("hide")
        $(`.${typeId} div`).addClass("view")

        $(`.${typeId} .defaultButtons`).removeClass("hide")
        $(`.${typeId} .defaultButtons`).addClass("view")

        $(`.${typeId} .editButtons`).addClass("view")
        $(`.${typeId} .editButtons`).addClass("hide")

        this.setState({
                newName: "",
                newBudget: ""
        });
    }

    handleSaveEditingType(typeId){
        event.preventDefault()
        console.log("save editing")
        console.log("send to backend: ")
        console.log(this.state)
        axios.put('/api/v1.0/type', {
            typeId: typeId,
            newName: this.state.newName,
            newBudget: this.state.newBudget,
            })
            .then(results => {
                console.log(results.data)
                let arrayOfTypes = [...this.state.types];

                let targetTypeIndex = arrayOfTypes.findIndex(function(type){
                    return type._id == results.data._id;
                });

                arrayOfTypes[targetTypeIndex] = results.data

                this.setState({
                    types: arrayOfTypes,
                    newBudget: "",
                    newName: ""
            });
                this.handleStopEditingType(typeId)

            })
            .catch(error => {
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else if(error.response.data != undefined) {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: ["Something went wrong", error],
                        showModalError: true
                    });
                }
            });

    }

    handleDeleteType(typeName, typeId) {
        event.preventDefault();

        let typeOther = this.state.types.find(type => type.name == "Other");
        console.log("type other is: ")
        console.log(typeOther)

        console.log("type to be deleted is: " + typeName + "and it's id is" + typeId)

        axios.delete(`/api/v1.0/type?type=${typeName}`)
            .then(results => {
                this.setState({ showModalSuccess: true, Message: [typeName + " type deleted successfully. All its expenses will be moved to type \"Other\""] });

                let arrayOfTypes = [...this.state.types];

                let targetTypeIndex = arrayOfTypes.findIndex(function(type){
                    return type._id == results.data._id;
                });

                arrayOfTypes.splice(targetTypeIndex, 1)



                //TRANSFER ALL EXPENSES TO "OTHER" TYPE
                for (let expense of this.state.expenses) {
                    if (expense.type.name == typeName) {
                        //update expense whose type got deleted. it will become Other
                        console.log("updating expense:")
                        console.log(expense)
                        axios.put('/api/v1.0/expense', { expenseId: expense._id, newTypeId: typeOther })
                            .then(results => {
                                console.log("expense updated")
                            })
                    }
                }

                this.setState({
                    types: arrayOfTypes,

                });

                this.handleStopEditingType(typeId)

                //Records expense deletion event
                ReactGA.event({
                    category: "Type",
                    action: "Deleted",
                });

            })
            .catch(error => {
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else if(error.response.data != undefined) {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: ["Something went wrong", error],
                        showModalError: true
                    });
                }
            });


    }



    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({ showModalSuccess: false,
                        displayLoginButton: false
        });
    }
    handleCloseError() {
        this.setState({ showModalError: false,
                    displayLoginButton: false
        });
    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;

        return (
            <>

                {isLoggedIn ? (
                    <>

                        <div className="col-12 my-3 col-sm-8 my-sm-4">

                        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} displayLoginButton={this.state.displayLoginButton} Message={this.state.Message} />
                        <ModalError handleClose={this.handleCloseError} displayLoginButton={this.state.displayLoginButton} showModalError={this.state.showModalError} errorMessages={this.state.Message} />
                            <table className="table">

                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Budget</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>

                                {this.state.types.map((type, index) =>
                                    <>
                                        <tr key={index} className={type._id}>
                                            <td>
                                                <input type="text" name="newName" placeholder={type.name} className="hide form-control" onChange={this.handleChange}/>

                                                <div className="view .userInfo">
                                                    {type.name}
                                                </div>
                                            </td>
                                            <td>
                                                <input type="text" name="newBudget" placeholder={type.budget} className="hide form-control" onChange={this.handleChange}/>

                                                <div className="view .userInfo">
                                                    {type.budget}
                                                </div>
                                            </td>
                                            <td className=" d-flex d-flex-row">
                                                <button onClick={this.handleSaveEditingType.bind(this, type._id)} className="editButtons hide btn h-50 m-1 btn-success" >
                                                <i className="fas fa-check"></i>
                                                </button>

                                                <button onClick={this.handleStartEditingType.bind(this, type._id)} className="defaultButtons view btn h-50 m-1 btn-secondary"  >
                                                <i className="fas fa-edit"></i>
                                                </button>


                                                <button onClick={this.handleDeleteType.bind(this, type.name, type._id )} className="editButtons hide btn h-50 m-1 btn-danger">
                                                <i className="fas fa-trash-alt"></i>
                                                </button>

                                                <button onClick={this.handleStopEditingType.bind(this, type._id)} className="editButtons hide btn h-50 m-1 btn-secondary">
                                                <i className="fas fa-times"></i>
                                                </button>
                                            </td>

                                        </tr>

                                    </>
                                )}
                                </tbody>


                            </table>


                        </div>

                    </>
                ) : <Navigate to="/login" />
                }
            </>


        )
    }
}
export default ManageTypes;

