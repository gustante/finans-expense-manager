import React from 'react';

class Form extends React.Component {



    render() {

        return (
            <>

                <div className="row">
                    <div className="col">
                        <form id="expenseForm" onSubmit={this.props.handleExpenseSubmit}>
                            <div className="row">

                                <div className="col-md-2 col-3">
                                    <label htmlFor="month" className="form-label">
                                        Month:

                                    </label>
                                    <select id="month" aria-required="true" name="month" className="form-control" value={this.props.month} onChange={this.props.handleChange}>
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
                                </div>

                                <div className="col-md-2 col-3">
                                    <label htmlFor="day" className="form-label">
                                        Day:
                                    </label>
                                    <input type="text" id="day" name="day" className="form-control" value={this.props.day} onChange={this.props.handleChange} />

                                </div>

                                <div className="col-md-2 col-sm-3 col-4">
                                    <label htmlFor="year" className="form-label">
                                        Year:

                                    </label>
                                    <input type="text" id="year" name="year" className="form-control" value={this.props.year} onChange={this.props.handleChange} />
                                </div>

                                <div className="col-2 col-sm-3 col-md-2 mt-2 mt-sm-1 pt-4">

                                    <button onClick={this.props.handleGetTodaysDate} className="btn btn-sm " >
                                        <span className="mx-1 d-none d-sm-inline ">Today </span>
                                        <i className="fas fa-calendar"></i>
                                    </button>

                                </div>

                            </div>


                            <div className="row justify-content-start">
                                <div className="col-md-4 col-12">
                                    <label htmlFor="desc" className="form-label">
                                        Description:

                                    </label>
                                    <input type="text" id="desc" name="desc" value={this.props.desc} className="form-control" onChange={this.props.handleChange} />
                                </div>




                                <div className="col-lg-2 col-md-2 col-sm-5 col-4">
                                    <label htmlFor="amount" className="form-label">
                                        Amount:

                                    </label>
                                    <input type="text" id="amount" name="amount" className="form-control" value={this.props.amount} onChange={this.props.handleChange} />
                                </div>

                                <div className="col-lg-3 col-md-4 col-sm-7 col-8">
                                    <label htmlFor="type" className="form-label">
                                        Type

                                    </label>
                                    <select id="type" className="form-control" name="type" value={this.props.type} onChange={this.props.handleChange}>
                                        <option value={this.props.type}>{this.props.type}</option>
                                        {this.props.typeDropDown.map((type, index) => <option key={index} value={type.name}>{type.name}</option>)}
                                    </select>

                                </div>


                            </div>

                            <div className="row d-flex ">
                                <div className="p-3 ml-4 mt-2">
                                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" onClick={this.props.handleCheckRecurring} name="recurring" />
                                    <label className="form-check-label" for="flexCheckDefault">
                                        Recurring
                                    </label>
                                </div>

                                <div className="dropdown d-none p-3 mt-2" onChange={this.props.handleGetFrequency}>
                                    <select id="type" className="form-control" name="type" >
                                        <option>Select frequency</option>
                                        <option value="weekly" >Weekly</option>
                                        <option value="bi-weekly" >Bi-weekly</option>
                                        <option value="monthly" >Monthly</option>
                                    </select>
                                </div>
                            </div>


                            <div className="row p-2 d-flex flex-grow">



                                <button type="submit" className="btn flex-fill m-1 btn-success">
                                    <span className="mx-1">Add </span>
                                    <i className="fas fa-plus"></i>
                                </button>






                                <button onClick={this.props.handleExpenseSearch} className="btn m-1 flex-fill btn-primary">
                                    <span className="mx-1 ">Filter</span>
                                    <i className="fas fa-filter"></i>
                                </button>




                                <button onClick={this.props.searchAll} className="btn m-1 flex-fill btn-info">
                                    <span className="mx-1">Search all</span>
                                    <i className="fas fa-search"></i>
                                </button>







                                <button onClick={this.props.clearFields} className="btn m-1 flex-fill btn-secondary">
                                    <span className="mx-1">Clear fields</span>
                                    <i className="fas fa-backspace"></i>
                                </button>



                                <div className=" m-1 flex-grow-1 d-inline d-flex ">
                                    <button id="typesDiv" className="btn btn-warning flex-fill" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                        <span className="mx-1">New type</span>
                                        <i className="fas fa-plus"></i>
                                    </button>

                                    <div style={{ position: "absolute", zIndex: "1" }} className="collapse m-2 mt-5" id="collapseExample">
                                        <div className="card card-body">
                                            <label htmlFor="typeName" className="form-label">
                                                Name

                                            </label>
                                            <input aria-label="create new type" id="typeName" name="typeName" type="text" value={this.props.typeName} className="form-control" onChange={this.props.handleChange} />

                                            <label htmlFor="typeBudget" className="form-label">
                                                Budget (Optional)

                                            </label>
                                            <input aria-label="create new type budget" id="typeBudget" name="typeBudget" type="text" value={this.props.typeBudget} className="form-control" onChange={this.props.handleChange} />



                                            <div className=" m-1">
                                                <button id="addType" onClick={this.props.handleCreateType} className="btn m-1 btn-success d-inline-block" >
                                                    <span className="mx-1">Create</span>
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>




                            </div>
                        </form>
                    </div>



                </div>



            </>
        )

    }
}

export default Form;