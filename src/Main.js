import React from 'react';
import ExpenseTable from './ExpenseTable';
import Form from './Form';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import axios from 'axios';
import ReactGA from 'react-ga';
import { Navigate } from "react-router-dom";


//Google analytics tracking ID
const trackingId = "UA-191727658-1";
ReactGA.initialize(trackingId);


const current = new Date();//get current date to set defaut date to today in the Main states for quicker expense creation

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expenses: [],//contains the expenses from database
            month: current.getMonth() + 1,
            day: current.getDate(),
            year: current.getFullYear(),
            type: "",
            typeDropDown: [],
            desc: "",
            amount: "",
            typeName: "",
            typeBudget: "",
            showModalSuccess: false,//controls display modal with success message
            showModalError: false,//controls display of modal with error message
            displayLoginButton: false,
            Message: [] //messages to be passed to success or error modal according to validation obtained
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleExpenseSubmit = this.handleExpenseSubmit.bind(this);
        this.handleExpenseSearch = this.handleExpenseSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.searchAll = this.searchAll.bind(this);
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);
        this.handleCreateType = this.handleCreateType.bind(this);
        this.clearFields = this.clearFields.bind(this);
        this.handleDeleteType = this.handleDeleteType.bind(this);

    }

    //mounts Main component and obtain all expenses in database, adding it to expense state
    componentDidMount() {
        if (this.props.isLoggedIn) {
            axios.get("/api/v1.0/expense/all")
                .then(results => {
                    let arrayOfExpenses = results.data
                    console.log(results.data);
                    this.setState({ expenses: arrayOfExpenses });

                })
                .catch(error => {
                    console.log(error)
                    console.log(error.response)


                    if(error.response.data.status == 401){
                        this.setState({displayLoginButton: true});
                    }
                    if(error.response.data != undefined){
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    }

                });

            axios.get("/api/v1.0/type/all")

                .then(results => {
                    let arrayOfTypes = results.data

                    this.setState({ typeDropDown: arrayOfTypes });

                })
                .catch(error => {
                    console.log(error)
                    console.log(error.response)
                    //if there are errors, update Message state with error messages and display Error modal
                    if(error.response.data != undefined){
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    }
                });


            window.addEventListener("keydown", e => {
                let target = $(this).parent();
                if (e.which == 27) {
                    console.log('closes modal');
                    this.setState({ showModalSuccess: false });
                    this.setState({ showModalError: false });
                }
            });
        }


    }

    //activated after submitting the form, sends the data from fields to backend to record expense in database
    handleExpenseSubmit(event) {
        event.preventDefault();

        let captchaToken = ''

        //Executes captcha after form is submitted, generates token and store it in a variable
        grecaptcha.execute('6LdmmoYaAAAAAPGLcESwa6m41uyXfKf0gQCrOtwc', { action: 'submit' })
            .then(function (token) {
                captchaToken = token;
                console.log("reCAPTCHA executed");

            })
            .then(() => {//creates expense and sends token to backend
                axios.post("/api/v1.0/expense", {
                    month: this.state.month,
                    day: this.state.day,
                    year: this.state.year,
                    type: this.state.type,
                    desc: this.state.desc,
                    amount: this.state.amount,
                    token: captchaToken
                })
                    .then(results => {
                        this.setState({ showModalSuccess: true, Message: ["ID: " + results.data._id, "Expense registered!"] }); //success message sends expense id to success modal and displays it

                        // Create a new array based on current state:
                        let arrayOfExpenses = [...this.state.expenses];

                        // Add item to it
                        arrayOfExpenses.unshift(results.data);

                        // Set state
                        this.setState({ expenses: arrayOfExpenses});


                        //Records expense creation event
                        ReactGA.event({
                            category: "Expense",
                            action: "Created",
                        });

                    })
                    .catch(error => {
                        console.log("we got an error")
                        console.log(error.response.data)//all the error messages!

                        //if there are errors, update Message state with error messages and display Error modal
                        //also display button to redirect to log in page if error is due to user unauthenticated
                        if(error.response.data.status == 401){
                            this.setState({displayLoginButton: true});
                        }
                        if(error.response.data != undefined){
                            this.setState({
                                Message: error.response.data.data,
                                showModalError: true
                            });
                        }
                    });
                })



    }

    handleCreateType() {
        event.preventDefault();

        let captchaToken = ''

        //Executes captcha after submittion, generates token and store it in a variable
        grecaptcha.execute('6LdmmoYaAAAAAPGLcESwa6m41uyXfKf0gQCrOtwc', { action: 'submit' })
            .then(function (token) {
                captchaToken = token;
                console.log("reCAPTCHA executed");
            })
            .then(() => {
                axios.post("/api/v1.0/type", { name: this.state.typeName, budget: this.state.typeBudget, token: captchaToken })
                    .then(results => {
                        this.setState({ showModalSuccess: true, Message: ["ID: " + results.data._id, "Type created successfully"] }); //success message sends expense id to success modal and displays it

                        let arrayOfTypes = [...this.state.typeDropDown];
                        //updates type state with new one, this will remount the form  with new type in the dropdown menu

                        arrayOfTypes.push(results.data);

                        this.setState({
                            typeDropDown: arrayOfTypes,
                            type: results.data.name,
                            typeName: "",
                            typeBudget: ""
                        });


                        console.log(this.state.typeDropDown)

                        //Records type creation event
                        ReactGA.event({
                            category: "Type",
                            action: "Created",
                        });


                    })
                    .catch(error => {
                        //if there are errors, update Message state with error messages and display Error modal
                        if(error.response.data.status == 401){
                            this.setState({displayLoginButton: true});

                        }
                        if(error.response.data != undefined){
                            this.setState({
                                Message: error.response.data.data,
                                showModalError: true
                            });
                        }
                    });
            })

    }

    handleDeleteType(event) {
        event.preventDefault();

        axios.delete(`/api/v1.0/type?type=${this.state.type}`)
            .then(deletedType => {
                console.log("deleted type is: " + deletedType)
                this.setState({ showModalSuccess: true, Message: [this.state.type + " type deleted successfully"] });

                let typeOther = this.state.typeDropDown.find(type => type.name == "Other");

                for (let expense of this.state.expenses) {
                    if (expense.type.name == this.state.type) {
                        //update expense whose type got deleted. it will become Other
                        axios.put('/api/v1.0/expense', { expenseId: expense._id, newTypeId: typeOther._id })
                            .then(results => {
                                console.log("expenses updated")
                                expense.type.name = "Other";
                            })
                    }
                }

                let arrayOfTypes = [...this.state.typeDropDown];

                let targetTypeIndex = arrayOfTypes.findIndex(function(type){
                    return type.name == this.state.type;
                });

                arrayOfTypes.splice(targetTypeIndex, 1)


                this.setState({
                    typeDropDown: arrayOfTypes,
                    type: ""

                });

                //Records expense deletion event
                ReactGA.event({
                    category: "Type",
                    action: "Deleted",
                });

            })
            .catch(error => {
                console.log(error)
                //if there are errors, update Message state with error messages and display Error modal
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                }
            });


    }

    //search expenses based on user input. Send values from inputs using query
    handleExpenseSearch(event) {
        event.preventDefault();
        axios.get(`/api/v1.0/expense?month=${this.state.month}&day=${this.state.day}&year=${this.state.year}&type=${this.state.type}&desc=${this.state.desc}&amount=${this.state.amount}`)
            .then(results => {
                console.log("received response from server")
                let arrayOfExpenses = results.data
                console.log(results.data)

                this.setState({ expenses: arrayOfExpenses });//update expenses state with the data obtained from database. this will remount ExpenseTable with records that matche the filters
                //Records expense filter event
                ReactGA.event({
                    category: "Expense",
                    action: "Filter",
                });
            })
            .catch(error => {
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                }
            });
    }

    //changes the states dinamically as user interacts with form fields
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    //deletes an expense based on id of the expense clicked
    handleDelete(expenseId, event) {
        axios.delete(`/api/v1.0/expense?expenseId=${expenseId}`)//send id when clicking on an expense from the table to backend so that it deletes from database
            .then(deletedExpense => {
                // Create a new array based on current state:
                let arrayOfExpenses = [...this.state.expenses];

                let targetedExpenseIndex = arrayOfExpenses.findIndex(function(expense){
                    return expense._id == expenseId;
                });

                arrayOfExpenses.splice(targetedExpenseIndex, 1)


                this.setState({ expenses: arrayOfExpenses }); //This will remount the ExpenseTable component without the deletes expense

                //Records expense deletion event
                ReactGA.event({
                    category: "Expense",
                    action: "Deleted",
                });

            })
            .catch(error => {
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                }
            });
    }

    handleEdit(expenseId){
        console.log("editing expense")
        axios.put('/api/v1.0/expense', { expenseId: expense._id, newTypeId: typeOther._id })
                            .then(results => {
                                console.log("expenses updated")
                                expense.type.name = "Other";
                            })
    }

    //obtains all expenses when user clicks search all button. Useful for getting the whole list again without refreshing the page
    searchAll(e) {
        event.preventDefault();
        axios.get("/api/v1.0/expense/all")
            .then(results => {
                let arrayOfExpenses = results.data

                this.setState({ expenses: arrayOfExpenses });

            })
            .catch(error => {
                console.log(error.response)
                if(error.response.data.status == 401){
                    this.setState({displayLoginButton: true});

                }
                if(error.response.data != undefined){
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                }
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

    //clears all fiels in the form
    clearFields() {
        event.preventDefault();
        this.setState({
            day: "",
            month: "",
            year: "",
            desc: "",
            type: "",
            amount: "",
            typeName: "",
            typeBudget: ""
        });

    }


    render() {

        let formProps = {
            clearFields: this.clearFields,
            handleExpenseSubmit: this.handleExpenseSubmit,
            handleExpenseSearch: this.handleExpenseSearch,
            handleCreateType: this.handleCreateType,
            handleChange: this.handleChange,
            month: this.state.month,
            day: this.state.day,
            year: this.state.year,
            desc: this.state.desc,
            type: this.state.type,
            typeDropDown: this.state.typeDropDown,
            typeName: this.state.typeName,
            amount: this.state.amount,
            searchAll: this.searchAll,
            handleDeleteType: this.handleDeleteType,
        }


        const isLoggedIn = this.props.isLoggedIn;

        return <>
            {isLoggedIn ? (
                <>
                    <div className="dashboard">
                        <div className="row">
                            <div className="col mx-3 my-5">
                                <h1 className="display-4">My expenses</h1>
                            </div>
                        </div>

                        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} Message={this.state.Message} />
                        <ModalError handleClose={this.handleCloseError} showModalError={this.state.showModalError} errorMessages={this.state.Message} displayLoginButton={this.state.displayLoginButton} />
                        <Form {...formProps} />
                        <ExpenseTable expenses={this.state.expenses} handleDelete={this.handleDelete} handleEdit={this.handleEdit} />
                    </div>

                </>
            ) : <Navigate to="/login" />
            }




        </>;

    }
}

export default Main;