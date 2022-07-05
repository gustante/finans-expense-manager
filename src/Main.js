import React from 'react';
import ExpenseTable from './ExpenseTable';
import Form from './Form';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import ExpenseCreatedAlert from "./ExpenseCreatedAlert.js"
import ExpenseDeletedAlert from "./ExpenseDeletedAlert.js"
import ExpenseEditedAlert from "./ExpenseEditedAlert.js"
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
            recurring: false,
            frequency: "",
            typeName: "",
            typeBudget: "",
            newDate: "",
            newType: "",
            newDesc: "",
            newAmount: "",
            showModalSuccess: false,//controls display modal with success message
            showModalError: false,//controls display of modal with error message
            displayLoginButton: false,
            Message: [], //messages to be passed to success or error modal according to validation obtained
            position: 15, //controls position to splice array of expenses and set pagination
            displayConfirmButton: false, //controls display of confirm button in modal
            displayDeleteJustOneButton: false, //controls display of delete just one button in modal
            expenseToBeDeleted: "",
            expenseToBeEdited: "",
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
        this.handleStopEditing = this.handleStopEditing.bind(this);
        this.handleStartEditing = this.handleStartEditing.bind(this);
        this.handleSaveEditChanges = this.handleSaveEditChanges.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleGetTodaysDate = this.handleGetTodaysDate.bind(this);
        this.handleGetFrequency = this.handleGetFrequency.bind(this);
        this.handleCheckRecurring = this.handleCheckRecurring.bind(this);
        this.handleUncheckRecurring = this.handleUncheckRecurring.bind(this);
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleDeleteAllRecurring = this.handleDeleteAllRecurring.bind(this);
        this.handleDeleteJustOne = this.handleDeleteJustOne.bind(this);
        this.handleConfirmEdit = this.handleConfirmEdit.bind(this);
        this.handleEditAllRecurring = this.handleEditAllRecurring.bind(this);
        this.handleEditJustOne = this.handleEditJustOne.bind(this);
        this.handleUpdateAllRecurring = this.handleUpdateAllRecurring.bind(this);

    }

    //mounts Main component and obtain all expenses in database, adding it to expense state
    componentDidMount() {
        if (this.props.isLoggedIn) {
            axios.get("/api/v1.0/expense/all")
                .then(results => {
                    this.setState({ expenses: results.data.splice(0, this.state.position) });

                })
                .catch(error => {
                    console.log(error.response)
                    if (error.response.data.status == 401) {
                        this.setState({ displayLoginButton: true });

                    }
                    if (error.response.data.data != undefined) {
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    } else {
                        this.setState({
                            Message: error.response.data,
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
                    console.log(error.response)
                    if (error.response.data.status == 401) {
                        this.setState({ displayLoginButton: true });

                    }
                    if (error.response.data.data != undefined) {
                        this.setState({
                            Message: error.response.data.data,
                            showModalError: true
                        });
                    } else {
                        this.setState({
                            Message: error.response.data,
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
                    recurring: this.state.recurring,
                    frequency: this.state.frequency,
                    token: captchaToken,

                })
                    .then(results => {
                        $('#expense-created-alert').removeClass("hide")
                        $('#expense-created-alert').addClass("view")

                        const myTimeout = setTimeout(function () {
                            $('#expense-created-alert').addClass("hide")
                        }, 5000);


                        // Create a new array based on current state:
                        let arrayOfExpenses = [...this.state.expenses];

                        // Add item to it
                        arrayOfExpenses.unshift(results.data[0]);
                        
                        //in case of recurring expense creation, add other repeated up until today's data which have been sent from backend
                        if(results.data[0].recurring == true ){
                            for(let i = 1; i < results.data.length; i++){
                                arrayOfExpenses.unshift(results.data[i]);
                            }
                        }

                        // Set state, reset recurring to no create others by accident for subsequent expense creation
                        this.setState({ expenses: arrayOfExpenses });
                        this.handleUncheckRecurring()

                        //Records expense creation event
                        ReactGA.event({
                            category: "Expense",
                            action: "Created",
                        });

                    })
                    .catch(error => {
                        console.log(error.response)
                        if (error.response.data.status == 401) {
                            this.setState({ displayLoginButton: true });

                        }
                        if (error.response.data.data != undefined) {
                            this.setState({
                                Message: error.response.data.data,
                                showModalError: true
                            });
                        } else {
                            this.setState({
                                Message: error.response.data,
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

                        $("div .collapse").removeClass("show")

                        //Records type creation event
                        ReactGA.event({
                            category: "Type",
                            action: "Created",
                        });


                    })
                    .catch(error => {
                        console.log(error.response)
                        if (error.response.data.status == 401) {
                            this.setState({ displayLoginButton: true });

                        }
                        if (error.response.data.data != undefined) {
                            this.setState({
                                Message: error.response.data.data,
                                showModalError: true
                            });
                        } else {
                            this.setState({
                                Message: error.response.data,
                                showModalError: true
                            });
                        }
                    });
            })

    }


    //search expenses based on user input. Send values from inputs using query
    handleExpenseSearch(event) {
        event.preventDefault();
        axios.get(`/api/v1.0/expense?month=${this.state.month}&day=${this.state.day}&year=${this.state.year}&type=${this.state.type}&desc=${this.state.desc}&amount=${this.state.amount}`)
            .then(results => {
                console.log("received response from server")
                let arrayOfExpenses = results.data

                this.setState({ expenses: arrayOfExpenses });//update expenses state with the data obtained from database. this will remount ExpenseTable with records that matche the filters
                //Records expense filter event
                ReactGA.event({
                    category: "Expense",
                    action: "Filter",
                });
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
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

    handleCheckRecurring(e) {
        this.setState({
            recurring: e.target.checked,
            frequency: "weekly",//default frequency is weekly, first item on select 
        })

        $(".dropdown select").val("weekly")

        if (e.target.checked) {
            $(".dropdown").removeClass("d-none")
            $(".dropdown").addClass("d-inline")
        } else if (!e.target.checked) {
            $(".dropdown").removeClass("d-inline")
            $(".dropdown").addClass("d-none")
        }
    }

    handleUncheckRecurring() {

        $(".dropdown").removeClass("d-inline")
        $(".dropdown").addClass("d-none")
        $("#flexCheckDefault").prop("checked", false)

        this.setState({
            recurring: false,
            frequency: "",
        })

    }

    handleGetFrequency(e) {
        e.preventDefault()
        this.setState({
            frequency: e.target.value
        })
        console.log(e.target.value)
    }

    handleConfirmDelete(expenseId, e) {
        e.preventDefault()
        this.setState({
            Message: ["This is a recurring expense. Do you want to delete all future expenses as well?"],
            showModalError: true,
            displayDeleteJustOneButton: true,
            expenseToBeDeleted: expenseId
        })

    }

    handleDeleteAllRecurring(e) {
        this.handleDelete(this.state.expenseToBeDeleted, e, "all")
        this.handleCloseError()
    }

    handleDeleteJustOne(e) {
        this.handleDelete(this.state.expenseToBeDeleted, e, "one")
        this.handleCloseError()
    }

    handleConfirmEdit(expenseId, e) {
        e.preventDefault()
        this.setState({
            Message: ["This is a recurring expense. Do you want to edit all future expenses as well?"],
            showModalError: true,
            displayEditJustOneButton: true,
            expenseToBeEdited: expenseId
        })
    }

    handleEditAllRecurring(e) {
        this.handleSaveEditChanges(this.state.expenseToBeEdited, e, "all")
        this.handleCloseError()
    }

    handleEditJustOne(e) {
        this.handleSaveEditChanges(this.state.expenseToBeEdited, e, "one")
        this.handleCloseError()
    }



    //deletes an expense based on id of the expense clicked
    handleDelete(expenseId, event, option) {
        axios.delete(`/api/v1.0/expense?expenseId=${expenseId}&option=${option}`)//send id when clicking on an expense from the table to backend so that it deletes from database
            .then(deletedExpense => {
                //updates sumOfExpenses
                axios.get('/api/v1.0/type/updateSumOfExpenses')
                // Create a new array based on current state:
                let arrayOfExpenses = [];

                if (option && option == "all") {
                    //find expense that has expenseId from arrayOfExpenses
                    let recurringExpenseDeleted = this.state.expenses.find(expense => expense._id == expenseId)
                    //filter out all future expenses that have the same description as recurringExpenseDeleted

                    for (let expense of this.state.expenses) {
                        //only add expense to array if it is not a future expense linked to the deleted one
                        if (expense.description != recurringExpenseDeleted.description || (expense.description == recurringExpenseDeleted.description && expense.day < recurringExpenseDeleted.day && expense.month == recurringExpenseDeleted.month || (expense.description == recurringExpenseDeleted.description && expense.month < recurringExpenseDeleted.month || (expense.description == recurringExpenseDeleted.description && expense.year < recurringExpenseDeleted.year)))) {
                            arrayOfExpenses.push(expense)
                        }
                    }

                } else {
                    arrayOfExpenses = [...this.state.expenses]
                    let targetedExpenseIndex = arrayOfExpenses.findIndex(function (expense) {
                        return expense._id == expenseId;
                    });

                    arrayOfExpenses.splice(targetedExpenseIndex, 1)
                }


                this.handleStopEditing(expenseId)

                this.setState({ expenses: arrayOfExpenses }); //This will remount the ExpenseTable component without the deletes expense

                $('#expense-deleted-alert').removeClass("hide")
                $('#expense-deleted-alert').addClass("view")

                const myTimeout = setTimeout(function () {
                    $('#expense-deleted-alert').addClass("hide")
                }, 5000);




                //Records expense deletion event
                ReactGA.event({
                    category: "Expense",
                    action: "Deleted",
                });

            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });
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
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });
    }

    //controls display of modals
    handleCloseSuccess() {
        this.setState({
            showModalSuccess: false,
            displayLoginButton: false
        });
    }
    handleCloseError() {
        this.setState({
            showModalError: false,
            displayLoginButton: false,
            displayConfirmButton: false,
            displayDeleteJustOneButton: false,
            displayEditJustOneButton: false
        });
    }

    handleStartEditing(expenseId) {

        //show inputs and buttons for editing
        $(`.${expenseId} select`).removeClass("hide")
        $(`.${expenseId} select`).addClass("view")
        $(`.${expenseId} input`).removeClass("hide")
        $(`.${expenseId} input`).addClass("view")
        $(`.${expenseId} td div`).removeClass("view")
        $(`.${expenseId} td div`).addClass("hide")
        $(`.${expenseId} .editButtons`).removeClass("hide")
        $(`.${expenseId} .editButtons`).addClass("view")
        $(`.${expenseId} .defaultButtons`).removeClass("view")
        $(`.${expenseId} .defaultButtons`).addClass("hide")

    }

    handleStopEditing(expenseId) {
        //hide info and other buttons
        $(`.${expenseId} td div`).removeClass("hide")
        $(`.${expenseId} td div`).addClass("view")
        $(`.${expenseId} select`).removeClass("show")
        $(`.${expenseId} select`).addClass("hide")
        $(`.${expenseId} input`).removeClass("view")
        $(`.${expenseId} input`).addClass("hide")
        $(`.${expenseId} .defaultButtons`).removeClass("hide")
        $(`.${expenseId} .defaultButtons`).addClass("view")
        $(`.${expenseId} .editButtons`).removeClass("view")
        $(`.${expenseId} .editButtons`).addClass("hide")

        this.setState({
            newDate: "",
            newType: "",
            newDesc: "",
            newAmount: "",
        });
    }

    handleSaveEditChanges(expenseId, e, option) {
        let splitDate = this.state.newDate.split("-")
        let newType = this.state.typeDropDown.find(type => type.name == this.state.newType);

        axios.put('/api/v1.0/expense', { expenseId: expenseId, newYear: splitDate[0], newMonth: splitDate[1], newDay: splitDate[2], newTypeId: newType, newDesc: this.state.newDesc, newAmount: this.state.newAmount, option: option })
            .then(results => {
                //update sumOfExpenses
                axios.get('/api/v1.0/type/updateSumOfExpenses')


                let updatedExpense = results.data;

                $('#expense-edited-alert').removeClass("hide")
                $('#expense-edited-alert').addClass("view")

                const myTimeout = setTimeout(function () {
                    $('#expense-edited-alert').addClass("hide")
                }, 5000);

                let arrayOfExpenses = [...this.state.expenses];

                let targetedExpenseIndex = arrayOfExpenses.findIndex(function (expense) {
                    return expense._id == updatedExpense._id;
                });

                //replace edited expense on the table.
                arrayOfExpenses[targetedExpenseIndex] = updatedExpense

                this.setState({ expenses: arrayOfExpenses });

                this.handleStopEditing(expenseId)

                if (option && option == 'all') {
                    this.handleUpdateAllRecurring()
                }


            })
            .catch(error => {
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });

    }

    //clears all fiels in the form
    clearFields(e) {
        e.preventDefault();
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

    handleLoadMore(option) {
        axios.get("/api/v1.0/expense/all")
            .then(results => {
                this.setState({
                    expenses: results.data.splice(0, (this.state.position + 15)),
                    position: (this.state.position + 15)
                });

            })
            .catch(error => {
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });
    }

    handleUpdateAllRecurring() {
        //get array of ids of all recurring expenses in this.state.expenses
        let recurringExpensesIds = this.state.expenses.filter(expense => expense.recurring == true).map(expense => expense._id);
        axios.get(`/api/v1.0/expense?ids=${recurringExpensesIds}`)
            .then(results => {
                let arrayOfExpenses = [...this.state.expenses];
                //replace all recurring expenses in arrayOfExpenses expenses with the ones from the server
                for (let i in arrayOfExpenses) {
                    for (let j in results.data) {
                        if (arrayOfExpenses[i]._id == results.data[j]._id) {
                            arrayOfExpenses[i] = results.data[j]
                        }
                    }
                }

                this.setState({ expenses: arrayOfExpenses });



                // this.setState({ expenses: arrayOfExpenses });//update expenses state with the data obtained from database. this will remount ExpenseTable with records that matche the filters
                // //Records expense filter event

            })
            .catch(error => {
                console.log(error)
                console.log(error.response)
                if (error.response.data.status == 401) {
                    this.setState({ displayLoginButton: true });

                }
                if (error.response.data.data != undefined) {
                    this.setState({
                        Message: error.response.data.data,
                        showModalError: true
                    });
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });
    }

    handleGetTodaysDate(e) {
        e.preventDefault();
        this.setState({
            month: current.getMonth() + 1,
            day: current.getDate(),
            year: current.getFullYear(),
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
            handleGetTodaysDate: this.handleGetTodaysDate,
            handleGetFrequency: this.handleGetFrequency,
            handleCheckRecurring: this.handleCheckRecurring,
        }

        let expenseTableProps = {
            clearFields: this.clearFields,
            expenses: this.state.expenses,
            handleDelete: this.handleDelete,
            typeDropDown: this.state.typeDropDown,
            handleSaveEditChanges: this.handleSaveEditChanges,
            handleStartEditing: this.handleStartEditing,
            handleStopEditing: this.handleStopEditing,
            handleChange: this.handleChange,
            newYear: this.state.newYear,
            newDay: this.state.newDay,
            newType: this.state.newType,
            newDesc: this.state.newDesc,
            newMonth: this.state.newMonth,
            newAmount: this.state.newAmount,
            handleLoadMore: this.handleLoadMore,
            handleConfirmDelete: this.handleConfirmDelete,
            handleConfirmEdit: this.handleConfirmEdit,
        }


        const isLoggedIn = this.props.isLoggedIn;

        return <>
            {isLoggedIn ? (
                <>

                    <ExpenseCreatedAlert />
                    <ExpenseDeletedAlert />
                    <ExpenseEditedAlert />
                    <div className="dashboard w-sm-50" >
                        <div className="row mx-3 my-5">

                            <h1 className="display-4">My expenses</h1>

                        </div>

                        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} Message={this.state.Message} />
                        <ModalError handleClose={this.handleCloseError} showModalError={this.state.showModalError} errorMessages={this.state.Message} displayLoginButton={this.state.displayLoginButton} displayConfirmButton={this.state.displayConfirmButton} displayDeleteJustOneButton={this.state.displayDeleteJustOneButton} handleDeleteAllRecurring={this.handleDeleteAllRecurring} handleDeleteOne={this.handleDeleteJustOne} displayEditJustOneButton={this.state.displayEditJustOneButton} handleEditJustOne={this.handleEditJustOne} handleEditAllRecurring={this.handleEditAllRecurring} />
                        <Form {...formProps} />
                        <ExpenseTable {...expenseTableProps} />

                    </div>

                </>
            ) : <Navigate to="/login" />
            }




        </>;

    }
}

export default Main;