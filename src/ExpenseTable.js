
import React from 'react';
import axios from 'axios';

class ExpenseTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            total: 0,//sum of all expenses displayed at the moment is shown at the end of the table, below amount
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps != this.props) {
            //get total amount of expenses whenever expense state from Main updates which generates a new table
            let sumOfExpenses = 0;
            for (let i of this.props.expenses) {
                sumOfExpenses += i.amount;
            }
            this.setState({ total: sumOfExpenses.toFixed(2) });
        }

    }

    render() {
        return <>
            <div className="row">
                <div className="col">
                    <table className="table table-responsive-sm" >
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th className="">Edit</th>
                            </tr>
                        </thead>

                            {this.props.expenses.map((expense, index) =>
                                <>
                                    <tbody>
                                    <tr key={index} className={expense._id} >


                                        <td>
                                            <input type="date" name="newDate" className="hide form-control" onChange={this.props.handleChange}/>

                                            <div className="view">
                                                {expense.year}/{expense.month}/{expense.day}
                                            </div>
                                        </td>


                                        <td>
                                            <select className="hide form-control" name="newType" value={this.props.newType} onChange={this.props.handleChange}>
                                            <option value={expense.type.name}>{expense.type.name}</option>)
                                                    {this.props.typeDropDown.map((type, index) => <option key={index} value={type.name}>{type.name}</option>)}
                                            </select>



                                            <div className="view">
                                                {expense.type.name}
                                            </div>
                                        </td>


                                        <td>
                                            <input type="text" name="newDesc" value={this.props.newDesc} className="hide form-control" placeholder={expense.description} onChange={this.props.handleChange} />

                                            <div className="view">
                                                {expense.description}
                                            </div>
                                        </td>


                                        <td>
                                            <input type="text" name="newAmount" value={this.props.newAmount} className="hide form-control" placeholder={expense.amount} onChange={this.props.handleChange} />

                                            <div className="view">
                                                ${expense.amount}
                                            </div>

                                        </td>


                                        <td className=" d-flex d-flex-row">

                                            <button onClick={this.props.handleSaveEditChanges.bind(this, expense._id)} className="editButtons hide btn h-50 m-1 btn-success" >
                                                <i className="fas fa-check"></i>
                                            </button>


                                            <button onClick={this.props.handleDelete.bind(this, expense._id)} className="editButtons hide btn h-50 m-1 btn-danger">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>

                                            <button onClick={this.props.handleStopEditing.bind(this, expense._id)} className="editButtons hide btn h-50 m-1 btn-secondary">
                                                <i className="fas fa-times"></i>
                                            </button>



                                            <button onClick={this.props.handleStartEditing.bind(this, expense._id)} className="defaultButtons view btn h-50 m-1 btn-secondary"  >
                                                <i className="fas fa-edit"></i>
                                            </button>



                                        </td>



                                    </tr>

                                    </tbody>

                                </>
                            )}




                    </table>
                                
                        
                        <div className="d-flex mb-5 justify-content-center">
                            <button className="btn btn-warning">Total: ${this.state.total}</button>
                            <button className="btn btn-primary mx-3 " onClick={this.props.handleLoadMore}> Load More Expenses </button>

                        </div>
                    

                </div>
            </div>
        </>;

    }
}

export default ExpenseTable;
