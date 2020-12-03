import React from 'react';

class Form extends React.Component {


    render(){
        
        return <>
            <form onSubmit={this.props.handleExpenseSubmit}>
                <div className="row md-2">
        
                <div className="col-md-2 m-1">
                <label>
                  Month:
                  <select className="form-control" value={this.props.month} onChange={this.props.handleChange.bind(this,'month')}>
                    <option value={this.props.month}>{this.props.month}</option>
                    <option value=""></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </label>
                </div>
                
                <div className="col-md-2 m-1">
                <label>
                  Day:
                  <input type="text" className="form-control" value={this.props.day} onChange={this.props.handleChange.bind(this,'day')}/>
                </label>
                </div>                                                      
                
                <div className="col-md-2 m-1">
                  <label>
                  Year:
                  <input type="text" className="form-control" value={this.props.year}  onChange={this.props.handleChange.bind(this,'year')}/>
                  </label>
                </div>
        
                <div className="col-md-2 m-1">
                <label>
                Type
                  <select className="form-control" value={this.props.type} onChange={this.props.handleChange.bind(this,'type')}>
                    <option value={this.props.type}>{this.props.type}</option>
                    {this.props.typeDropDown.map((type,index)=><option key={index} value={type.name}>{type.name}</option>)}
                  </select>
                </label>
                </div>
                
                <div className="col-md-2 m-1">
                <label>
                New type
                  <input type="text" value={this.props.newType} className="form-control" onChange={this.props.handleChange.bind(this,'newType')}/>
                </label>
                <button onClick={this.props.handleCreateType}className="btn btn-success">
                    <span className="mx-1">Add type</span>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="row md-2">
                <div className="col-md-3 m-1">
                <label>
                Description:
                  <input type="text" value={this.props.desc} className="form-control" onChange={this.props.handleChange.bind(this,'desc')}/>
                </label>
                </div>
        
                <div className="col-md-2 m-1">
                  <label>
                  Amount:
                  <input type="text" className="form-control" value={this.props.amount} onChange={this.props.handleChange.bind(this,'amount')}/>
                  </label>
                </div>
        
                <div className="col-md-2 d-flex align-items-center">
                  <button type="submit" className="btn btn-success">
                    <span className="mx-1">Add expense</span>
                    <i className="fas fa-plus"></i>
                  </button>
                  <button onClick={this.props.handleExpenseSearch} className="btn mx-1 btn-primary">
                    <span className="mx-1">Filter</span>
                    <i className="fas fa-filter"></i>
                  </button>
                  <button onClick={this.props.searchAll} className="btn mx-1 btn-info">
                    <span className="mx-1">Search all</span>
                    <i className="fas fa-search"></i>
                  </button>
                  <button onClick={this.props.clearFields} className="btn mx-1 btn-secondary">
                    <span className="mx-1">Clear fields</span>
                    <i className="fas fa-backspace"></i>
                  </button>
                </div>
              </div>
        </form>
        </>; 
        
    }
}

export default Form;