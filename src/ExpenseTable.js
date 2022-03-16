import React from 'react';

class ExpenseTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            total: 0//sum of all expenses displayed at the moment is shown at the end of the table, below amount
        }

        this.componentDidUpdate = this.componentDidUpdate.bind(this);

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.expenses != this.props.expenses) {

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
                    <table className="table" >
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th className="d-sm-table-cell d-none">Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Edit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.props.expenses.map((expense, index) =>
                                <tr key={index}>
                                    <td>{expense.month}/{expense.day}/{expense.year}</td>
                                    <td className="d-sm-table-cell d-none">{expense.type.name}</td>
                                    <td>{expense.description}</td>
                                    <td>${expense.amount}</td>
                                    <td>
                                        <button aria-label="edit this expense" onClick={this.props.handleEdit.bind(this, expense._id)} className="btn h-50 mx-1 btn-secondary">
                                        <i className="fas fa-edit"></i>
                                        </button>

                                        <button aria-label="delete this expense" onClick={this.props.handleDelete.bind(this, expense._id)} className="btn h-50 mx-1 btn-danger">
                                        <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>

                                </tr>)}


                        </tbody>


                    </table>
                    <div className="text-center mb-5">
                        <span className="p-3 badge badge-warning">Total: ${this.state.total}</span>
                    </div>

                </div>
            </div>
        </>;

    }
}

export default ExpenseTable;