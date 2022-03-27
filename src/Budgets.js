import React from 'react';
import axios from 'axios';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import { Navigate } from "react-router-dom";

const today = new Date();
class Budgets extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            types: [],
            currentMonth: today.getMonth() + 1,
            totalBudget: "",
            totalInsideBudget: "",
            totalSpent: "",
            showModalSuccess: false,
            showModalError: false,
            Message: [],
            displayLoginButton: false

        }
        this.handleEditMonth = this.handleEditMonth.bind(this);
        this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
        this.handleCloseError = this.handleCloseError.bind(this);


    }

    componentDidMount() {
        axios.get("/api/v1.0/type/all")
            .then(results => {
                let totalSpent = 0;
                let totalBudget = 0;
                let totalInsideBudget = 0;
                for (let type of results.data) {
                    if(type.budget){
                        totalBudget += type.budget;
                        totalInsideBudget += type.sumOfExpenses;
                        totalSpent += type.sumOfExpenses;
                    } else {
                        totalSpent += type.sumOfExpenses;
                    }


                }
                this.setState({
                    types: results.data,
                    totalSpent: totalSpent.toFixed(2),
                    totalBudget: totalBudget,
                    totalInsideBudget: totalInsideBudget.toFixed(2)
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
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });
    }



    handleEditMonth(option) {
        let currentMonth = this.state.currentMonth;
        if (option == 'next') {
            console.log('increase month')
            currentMonth++;
            this.setState({
                currentMonth: currentMonth
            });
        } else if (option == 'prev') {
            console.log('decrease month')
            currentMonth--;
            this.setState({
                currentMonth: currentMonth
            });
        }

        axios.get(`/api/v1.0/expense?month=${currentMonth}&day=&year=&type=&desc=&amount=`)
            .then(results => {
                let arrayOfExpenses = results.data

                let arrayOfTypes = [...this.state.types];

                let totalInsideBudget = 0;
                let totalSpent = 0;

                //reset sum of expenses of all types in state
                for (let type of arrayOfTypes) {
                    type.sumOfExpenses = 0
                }
                //adjust sumOfExpenses to selected month
                for (let expense of arrayOfExpenses) {
                    if(expense.type.budget){
                        totalInsideBudget += expense.amount;
                        totalSpent += expense.amount

                    } else {
                        totalSpent += expense.amount
                    }
                    for (let type of arrayOfTypes) {
                        if (expense.type.name == type.name) {
                            type.sumOfExpenses += expense.amount
                        }
                    }

                }

                this.setState({
                    types: arrayOfTypes,
                    totalSpent: totalSpent.toFixed(2),
                    totalInsideBudget: totalInsideBudget.toFixed(2)
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
                } else {
                    this.setState({
                        Message: error.response.data,
                        showModalError: true
                    });
                }
            });

        ////////////////////////////


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
        let monthString = ""
        switch (this.state.currentMonth) {
            case 1: monthString = "January";
                break;
            case 2: monthString = "February";
                break;
            case 3: monthString = "March";
                break;
            case 4: monthString = "April";
                break;
            case 5: monthString = "May";
                break;
            case 6: monthString = "June";
                break;
            case 7: monthString = "July";
                break;
            case 8: monthString = "August";
                break;
            case 9: monthString = "September";
                break;
            case 10: monthString = "October";
                break;
            case 11: monthString = "November";
                break;
            case 12: monthString = "December";
                break;
        }

        return (
            <>
                {isLoggedIn ? (
                    <>
                        <main className="px-3 py-3 col-12 col-md-9">
                            <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} displayLoginButton={this.state.displayLoginButton} Message={this.state.Message} />
                            <ModalError handleClose={this.handleCloseError} displayLoginButton={this.state.displayLoginButton} showModalError={this.state.showModalError} errorMessages={this.state.Message} />


                            <table className="table ">
                                <thead className="">
                                    <tr>
                                        <th>Type</th>
                                        <th>Budget</th>
                                        <th>Total in {monthString}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.types.map((type, index) =>
                                        <tr key={index}>
                                            <td>{type.name}
                                            <div className="progress mt-1">
                                                <div className={`progress-bar ${ Math.round((type.sumOfExpenses * 100) / type.budget) > 100 ? 'bg-danger' : 'bg-success' }`} role="progressbar" style={{width: `${Math.round((type.sumOfExpenses * 100) / type.budget) }%`}}  aria-valuenow={Math.round((type.sumOfExpenses * 100) / type.budget)} aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            </td>
                                            <td className="font-weight-bold">{`${type.budget ? type.budget : ' --'}`}</td>
                                            {type.budget ? <td className={`${ type.sumOfExpenses > type.budget ? 'text-danger font-weight-bold' : 'text-dark' }`}>{type.sumOfExpenses.toFixed(2)}</td> : <td>{type.sumOfExpenses.toFixed(2)}</td>}

                                        </tr>)
                                    }
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </tbody>

                            </table>
                            <div className="text-center mb-3">
                                <span className="p-3 m-1 badge badge-warning">Total Budget: ${this.state.totalBudget}</span>
                                <span className="p-3 m-1 badge badge-warning">Total inside Budget: ${this.state.totalInsideBudget}</span>
                                <span className="p-3 badge badge-warning">Total Spent: ${this.state.totalSpent}</span>
                            </div>

                            <div className="d-flex justify-content-center">

                                <ul className="pagination ">
                                    <li className="page-item"><button className="page-link" onClick={this.handleEditMonth.bind(this, 'prev')}>Previous month</button></li>

                                    <li className="page-item"><button className="page-link" onClick={this.handleEditMonth.bind(this, 'next')}>Next month</button></li>
                                </ul>
                            </div>
                        </main>

                    </>
                ) : <Navigate to="/login" />
                }
            </>

        )
    }
}
export default Budgets;

