import React from 'react';

class Form extends React.Component {


    render() {

        return <>

            <div className="row mx-1">
                <div className="col">
                    <form onSubmit={this.props.handleExpenseSubmit}>
                        <div className="row">

                            <div className="col-md-2 col-sm-3">
                                <label htmlFor="month" className="form-label">
                                    Month:

                                </label>
                                <select className="form-control" value={this.props.month} onChange={this.props.handleChange.bind(this, 'month')}>
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

                            <div className="col-md-2 col-sm-3">
                                <label htmlFor="day" className="form-label">
                                    Day:
                                </label>
                                <input type="text" className="form-control" value={this.props.day} onChange={this.props.handleChange.bind(this, 'day')} />

                            </div>

                            <div className="col-md-2 col-sm-3">
                                <label htmlFor="year" className="form-label">
                                    Year:

                                </label>
                                <input type="text" className="form-control" value={this.props.year} onChange={this.props.handleChange.bind(this, 'year')} />
                            </div>

                            <div className="col-md-2 col-sm-3">
                                <label htmlFor="amount" className="form-label">
                                    Amount:

                                </label>
                                <input type="text" className="form-control" value={this.props.amount} onChange={this.props.handleChange.bind(this, 'amount')} />
                            </div>
                        </div>


                        <div className="row justify-content-start">
                            <div className="col-lg-4 col-md-4 col-sm-6">
                                <label htmlFor="description" className="form-label">
                                    Description:

                                </label>
                                <input type="text" value={this.props.desc} className="form-control" onChange={this.props.handleChange.bind(this, 'desc')} />
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-6">
                                <label htmlFor="type" className="form-label">
                                    Type

                                </label>
                                <select className="form-control" value={this.props.type} onChange={this.props.handleChange.bind(this, 'type')}>
                                    <option value={this.props.type}>{this.props.type}</option>
                                    {this.props.typeDropDown.map((type, index) => <option key={index} value={type.name}>{type.name}</option>)}
                                </select>

                            </div>


                        </div>


                        <div className="row mt-3">
                            <div className="col-lg-12 col-md-12 col-sm-12 d-flex flex-wrap">

                                <div className=" m-1">
                                    <button type="submit" className="btn btn-success">
                                        <span className="mx-1">Add <span className="">expense</span></span>
                                        <i className="fas fa-plus"></i>
                                    </button>

                                </div>


                                <div className=" m-1">

                                    <button onClick={this.props.handleExpenseSearch} className="btn btn-primary">
                                        <span className="mx-1 ">Filter</span>
                                        <i className="fas fa-filter"></i>
                                    </button>

                                </div>

                                <div className=" m-1">
                                    <button onClick={this.props.searchAll} className="btn btn-info">
                                        <span className="mx-1">Search all</span>
                                        <i className="fas fa-search"></i>
                                    </button>

                                </div>

                                

                                <div className=" m-1">

                                    <button onClick={this.props.clearFields} className="btn btn-secondary">
                                        <span className="mx-1">Clear fields</span>
                                        <i className="fas fa-backspace"></i>
                                    </button>

                                </div>

                                <div className=" m-1 ">
                                    <button className="btn btn-warning d-inline-block" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                        Manage Types
                                    </button>

                                    <div className="collapse m-2" id="collapseExample">
                                        <div className="card card-body">
                                            <label htmlFor="typeName" className="form-label">
                                                New type

                                            </label>
                                            <input type="text" value={this.props.typeName} className="form-control" onChange={this.props.handleChange.bind(this, 'typeName')} />
                                            <button onClick={this.props.handleCreateType} className="btn m-1 btn-success d-inline-block" >
                                                <span className="mx-1">Add type</span>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <button onClick={this.props.handleDeleteType} className="btn m-1 btn-danger d-inline-block">
                                                <span className="mx-1">Delete type</span>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>

                                </div>



                            </div>
                        </div>
                    </form>
                </div>



            </div>



        </>;

    }
}

export default Form;