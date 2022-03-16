import React from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";

const today = new Date();
class Budgets extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            types: [],
            currentMonth: today.getMonth() + 1,
            totalBudget: "",
            totalSpent: "",



        }
        this.handleEditMonth = this.handleEditMonth.bind(this);


    }

    componentDidMount() {
        axios.get("/api/v1.0/user/budgetInfo")
            .then(results => {
                let totalSpent = 0;
                let totalBudget = 0;
                for (let type of results.data.types) {
                    totalSpent += type.sumOfExpenses;
                    totalBudget += type.budget;


                }
                this.setState({
                    types: results.data.types,
                    totalSpent: totalSpent.toFixed(2),
                    totalBudget: totalBudget
                });

            })
            .catch(error => {
                console.log(error.response.data)
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
                console.log(arrayOfExpenses)
                console.log(arrayOfTypes)


                let totalOfAllExpenses = 0;

                for (let type of arrayOfTypes) {
                    type.sumOfExpenses = 0
                }
                for (let expense of arrayOfExpenses) {
                    totalOfAllExpenses += expense.amount;
                    for (let type of arrayOfTypes) {
                        if (expense.type.name == type.name) {
                            type.sumOfExpenses += expense.amount
                        }
                    }

                }

                this.setState({
                    types: arrayOfTypes,
                    totalSpent: totalOfAllExpenses.toFixed(2)
                });




            })
            .catch(error => {
                console.log(error)

                this.setState({
                    Message: error.response.data.data,
                    showModalError: true
                });
            });

        ////////////////////////////


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
                                            <td>{type.name}</td>
                                            <td>{type.budget}</td>
                                            <td>{type.sumOfExpenses.toFixed(2)}</td>
                                        </tr>)
                                    }
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </tbody>

                            </table>
                            <div className="text-center mb-5">
                                <span className="p-3 m-1 badge badge-warning">Total Budget: ${this.state.totalBudget}</span>
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

