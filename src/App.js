import React from 'react';
import ExpenseTable from './ExpenseTable';
import Form from './Form';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import axios from 'axios';

const current = new Date();//get current date to set defaut date to today in the App states for quicker expense creation

class App extends React.Component {

    constructor(props){
        super(props);
        
        this.state={
            expenses: [],//contains the expenses from database
            month: current.getMonth()+1, 
            day: current.getDate(),
            year: current.getFullYear(),
            type: "",
            desc: "",
            amount: "",
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
        this.clearFields = this.clearFields.bind(this);
        
    }
    
    //mounts App component and obtain all expenses in database, adding it to expense state
    componentDidMount(){
        axios.get("/api/v1.0/expense/all")
        .then(results=>{
            let arrayOfExpenses = results.data
            
            this.setState({ expenses:arrayOfExpenses });
            
        })
        .catch(error=>console.log(error)); 
    }
        
    //activated after submitting the form, sends the data from fields to backend to record expense in database
    handleExpenseSubmit(event){
            event.preventDefault();
            axios.post("/api/v1.0/expense", {month: this.state.month,
                                    day: this.state.day, 
                                    year:this.state.year,
                                    type:this.state.type,
                                    desc:this.state.desc,
                                    amount:this.state.amount})
            .then(results=>{
                if(results.data[0] === undefined){//if no errors, it will return an object with recordedExpense, this condition will be true
                    this.setState({ showModalSuccess:true, Message: [results.data._id] }); //success message sends expense id to success modal and displays it
                    let arrayOfExpenses = []
                    
                    if(this.state.expenses.length > 0) {//updates state with new expense, this will remount the ExpenseTable component with new expense in the table
                        for(let i of this.state.expenses){
                            arrayOfExpenses.push(i)
                        }
                        arrayOfExpenses.push(results.data);
                        this.setState({ expenses:arrayOfExpenses });
                    } 
                }else {//if there are errors, update Message state with error messages and display Error modal
                        this.setState({ 
                            Message: results.data,
                            showModalError:true
                        });
                    }
                
                
                    
            })
            .catch(error=>{
                console.log(error)
            });
        }
    
    //search expenses based on user input. Send values from inputs using query
    handleExpenseSearch(event){
            event.preventDefault();
            axios.get(`/api/v1.0/expense?month=${this.state.month}&day=${this.state.day}&year=${this.state.year}&type=${this.state.type}&desc=${this.state.desc}&amount=${this.state.amount}`)
            .then(results=>{
                
                let arrayOfExpenses = results.data
            
                this.setState({ expenses:arrayOfExpenses });//update expenses state with the data obtained from database. this will remount ExpenseTable with records that matche the filters
            })
            .catch(error=>console.log(error));
        }
    
    //changes the states dinamically as user interacts with form fields
    handleChange(field,e){
        if(field == 'desc'){
            this.setState({
            desc: e.target.value
            }) 
        } else if(field == 'day'){
            this.setState({
            day: e.target.value
            }) 
        } else if(field == 'month'){
            this.setState({
            month: e.target.value
            }) 
        } else if(field == 'year'){
            this.setState({
            year: e.target.value
            }) 
        } else if(field == 'amount'){
            this.setState({
            amount: e.target.value
            }) 
        } else if(field == 'type'){
            this.setState({
            type: e.target.value
            }) 
        }
            
        
    }
    
    //deletes an expense based on id of the expense clicked
    handleDelete(expenseId, event){
      axios.delete(`/api/v1.0/expense?expense=${expenseId}`)//send id when clicking on an expense from the table to backend so that it deletes from database
      .then(deletedExpense=>{
        let arrayOfExpenses = []
        
        //clones array with expenses in the current state
        for(let i of this.state.expenses){
            arrayOfExpenses.push(i)
        }
        
        for(let i in arrayOfExpenses){
            if(arrayOfExpenses[i]._id == expenseId){
                arrayOfExpenses.splice(i, 1);//delete from expense state array the expense the user clicked by comparing the ids. 
            }
        }
      
        this.setState({ expenses:arrayOfExpenses }); //This will remount the ExpenseTable component without the deletes expense
      
      })
      .catch(error=>console.log(error));
    }
    
    //obtains all expenses when user clicks search all button. Useful for getting the whole list again without refreshing the page
    searchAll(e){
        event.preventDefault();
        axios.get("/api/v1.0/expense/all")
        .then(results=>{
            let arrayOfExpenses = results.data
            
            this.setState({ expenses:arrayOfExpenses });
            
        })
        .catch(error=>console.log(error)); 
    }
    
    //controls display of modals
    handleCloseSuccess(){
        this.setState({ showModalSuccess:false });
    }
    handleCloseError(){
        this.setState({ showModalError:false });
    }
    
    //clears all fiels in the form
    clearFields(){
        event.preventDefault();
        this.setState({ day:"",
                        month: "",
                        year: "",
                        desc: "",
                        type: "",
                        amount: "",
        });

    }

    
    render(){
        
        let formProps = {
            clearFields:this.clearFields,
            handleExpenseSubmit:this.handleExpenseSubmit,
            handleExpenseSearch:this.handleExpenseSearch,
            handleChange:this.handleChange,
            month:this.state.month,
            day:this.state.day,
            year:this.state.year,
            desc:this.state.desc,
            type:this.state.type,
            amount:this.state.amount,
            searchAll:this.searchAll
        }
        
        return <>
        <div className="row">
            <div className="col mb-5">
              <h1 className="display-4">Expense tracker</h1>
            </div>
        </div>
        
        <Form {...formProps} />
        <ExpenseTable expenses={this.state.expenses} handleDelete={this.handleDelete} />
        <ModalSuccess handleClose={this.handleCloseSuccess} showModalSuccess={this.state.showModalSuccess} Message={this.state.Message} />
        <ModalError handleClose={this.handleCloseError} showModalError={this.state.showModalError} errorMessages={this.state.Message} />
        
      
        </>; 
        
    }
}

export default App;