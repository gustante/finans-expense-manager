import React from 'react';
import axios from 'axios';

class ExpenseTable extends React.Component {
  
    constructor(props){
          super(props);
          
          this.state={
              total: 0//sum of all expenses displayed at the moment is shown at the end of the table, below amount
          }
          
          this.componentDidUpdate = this.componentDidUpdate.bind(this); 
          
      }
  
    componentDidUpdate(prevProps, prevState) {
              if(prevProps.expenses != this.props.expenses){
                  
                  //get total amount of expenses whenever expense state from App updates which generates a new table
                  let sumOfExpenses = 0;
                  for(let i of this.props.expenses){
                    sumOfExpenses += i.amount;
                  }
                  this.setState({ total:sumOfExpenses });
              }
          }
    

    render(){
        
        return <>
            <div className="row">
                <div className="col">
                  <table className="table" >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    
                    <tbody>
                      {this.props.expenses.map((expense,index)=>
                      <tr key={index}> 
                        <td>{expense.month}/{expense.day}/{expense.year}</td> 
                        <td>{expense.type.name}</td>  
                        <td>{expense.description}</td>
                        <td>${expense.amount}</td>
                        <td><button onClick={this.props.handleDelete.bind(this,expense._id)} className="btn h-50 mx-1 btn-danger">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                        </td>
                        
                      </tr>)}
                      
                      <tr> 
                        <td></td> 
                        <td></td>  
                        <td></td>
                        <td><span className="p-2 btn btn-warning">Total: ${this.state.total}</span></td>
                        <td></td>
                      </tr>
                    </tbody>
        
                    
                  </table>

        
                </div>
        </div>
        </>; 
        
    }
}

export default ExpenseTable;