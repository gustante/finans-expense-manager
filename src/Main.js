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
            showModalSuccess: false,//controls display modal with success message
            showModalError: false,//controls display of modal with error message
            Message: [] //messages to be passed to success or error modal according to validation obtained
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleExpenseSubmit = this.handleExpenseSubmit.bind(this);
        this.handleExpenseSearch = this.handleExpenseSearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
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
                    this.setState({ expenses: arrayOfExpenses.reverse() });

                })
                .catch(error => console.log(error));
            console.log("user requesting the expense list is: " + this.props.userId + "is the user logged in? :" + this.props.isLoggedIn)
            axios.get("/api/v1.0/type/all")

                .then(results => {
                    let arrayOfTypes = results.data

                    this.setState({ typeDropDown: arrayOfTypes });

                })
                .catch(error => console.log(error));

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
                        let arrayOfExpenses = []
                        if (this.state.expenses.length > 0) {//updates state with new expense, this will remount the ExpenseTable component with new expense in the table
                            for (let i of this.state.expenses) {
                                arrayOfExpenses.push(i)
                            }
                            arrayOfExpenses.unshift(results.data);
                            this.setState({ expenses: arrayOfExpenses });

                        }
                        //Records expense creation event
                        ReactGA.event({
                            category: "Expense",
                            action: "Created",
                        });


                    })
                    .catch(error => {
                        console.log(error.response.data)//all the error messages!

                        //if there are errors, update Message state with error messages and display Error modal
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
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
                axios.post("/api/v1.0/type", { name: this.state.typeName, token: captchaToken })
                    .then(results => {
                        this.setState({ showModalSuccess: true, Message: ["ID: " + results.data._id, "Type created successfully"] }); //success message sends expense id to success modal and displays it
                        let arrayOfTypes = []

                        //updates type state with new one, this will remount the form  with new type in the dropdown menu
                        for (let i of this.state.typeDropDown) {
                            arrayOfTypes.push(i)
                        }
                        arrayOfTypes.push(results.data);
                        this.setState({
                            typeDropDown: arrayOfTypes,
                            type: results.data.name
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
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    });
            })

    }

    handleDeleteType(event) {
        event.preventDefault();

        axios.delete(`/api/v1.0/type?type=${this.state.typeName}`)
            .then(deletedType => {
                this.setState({ showModalSuccess: true, Message: [this.state.typeName + " type deleted successfully"] });
                let arrayOfTypes = []

                let typeOther = this.state.typeDropDown.find(type => type.name == "Other");

                for (let expense of this.state.expenses) {
                    if (expense.type.name == this.state.typeName) {
                        //update expense whose type got deleted. it will become Other
                        axios.put('/api/v1.0/expense', { expenseId: expense._id, newTypeId: typeOther._id })
                            .then(results => {
                                console.log("expenses updated")
                                expense.type.name = "Other";
                            })
                    }
                }

                //clones array with expenses in the current state
                for (let i of this.state.typeDropDown) {
                    arrayOfTypes.push(i)
                }


                for (let i in arrayOfTypes) {
                    if (arrayOfTypes[i].name == this.state.typeName) {
                        arrayOfTypes.splice(i, 1);//delete the one that's been removed so we update the state.
                    }
                }

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
                this.setState({
                    Message: error.response.data.data,
                    showModalError: true
                });
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

                this.setState({ expenses: arrayOfExpenses.reverse() });//update expenses state with the data obtained from database. this will remount ExpenseTable with records that matche the filters
                //Records expense filter event
                ReactGA.event({
                    category: "Expense",
                    action: "Filter",
                });
            })
            .catch(error => console.log(error));
    }

    //changes the states dinamically as user interacts with form fields
    handleChange(field, e) {
        if (field == 'desc') {
            this.setState({
                desc: e.target.value
            })
        } else if (field == 'day') {
            this.setState({
                day: e.target.value
            })
        } else if (field == 'month') {
            this.setState({
                month: e.target.value
            })
        } else if (field == 'year') {
            this.setState({
                year: e.target.value
            })
        } else if (field == 'amount') {
            this.setState({
                amount: e.target.value
            })
        } else if (field == 'type') {
            this.setState({
                type: e.target.value
            })
        } else if (field == 'typeName') {
            this.setState({
                typeName: e.target.value
            })
        }


    }

    //deletes an expense based on id of the expense clicked
    handleDelete(expenseId, event) {
        axios.delete(`/api/v1.0/expense?expense=${expenseId}`)//send id when clicking on an expense from the table to backend so that it deletes from database
            .then(deletedExpense => {
                let arrayOfExpenses = []

                //clones array with expenses in the current state
                for (let i of this.state.expenses) {
                    arrayOfExpenses.push(i)
                }

                for (let i in arrayOfExpenses) {
                    if (arrayOfExpenses[i]._id == expenseId) {
                        arrayOfExpenses.splice(i, 1);//delete from expense state array the expense the user clicked by comparing the ids. 
                    }
                }

                this.setState({ expenses: arrayOfExpenses }); //This will remount the ExpenseTable component without the deletes expense

                //Records expense deletion event
                ReactGA.event({
                    category: "Expense",
                    action: "Deleted",
                });

            })
            .catch(error => console.log(error));
    }

    //obtains all expenses when user clicks search all button. Useful for getting the whole list again without refreshing the page
    searchAll(e) {
        event.preventDefault();
        axios.get("/api/v1.0/expense/all")
            .then(results => {
                let arrayOfExpenses = results.data

                this.setState({ expenses: arrayOfExpenses.reverse() });

            })
            .catch(error => console.log(error));
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({ showModalSuccess: false });
    }
    handleCloseError() {
        this.setState({ showModalError: false });
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
            handleDeleteType: this.handleDeleteType
        }

        const isLoggedIn = this.props.isLoggedIn;

        return <>
            {isLoggedIn ? (
                <>
                    <div id="dashboard">
                        <div className="row">
                            <div className="col mx-3 my-5">
                                <h1 className="display-4">My expenses</h1>
                            </div>
                        </div>

                        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} Message={this.state.Message} />
                        <ModalError handleClose={this.handleCloseError} showModalError={this.state.showModalError} errorMessages={this.state.Message} />
                        <Form {...formProps} />
                        <ExpenseTable expenses={this.state.expenses} handleDelete={this.handleDelete} />
                    </div>

                </>
            ) : <Navigate to="/login" />
            }




        </>;

    }
}

export default Main;