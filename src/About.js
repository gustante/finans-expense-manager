import React from 'react';
import { Link } from "react-router-dom";

function About() {

    return (



        <div className="dashboard mb-5">
            <div className=" my-2">
                <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <h1 className="display-4">About finans</h1>
                    <p className="lead">Finans is a simple and easy-to-use application to keep your spendings in control. It creates a detailed record of expenses and provides several other tools to help you manage them. Get started with the steps below!</p>
                </div>

                <div className="row row-cols-1 row-cols-md-2">
                    <div className="col mb-4">
                        <div className="card h-100">
                            <div class="card-header">Step 1</div>
                            <div className="card-body">
                                <h5 className="card-title">Record</h5>
                                <p className="card-text">After register and logging in, you can start loading your expenses at the dashboard and create a table with the records. Fill all the fields with day, month, year, type, description and amount, then click the add button to register a new transaction, which will promptly be added to the end of the table.</p>
                                <p>If it's your first time, you might wanna go ahead and create your first type to organize your spendings!</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100">
                        <div class="card-header">Step 2</div>
                            <div className="card-body">
                                <h5 className="card-title">Filter</h5>
                                <p className="card-text">You can also dynamically filter expenses based on the information contained in the fields. As an example, click the button to clear all the fields and then select only type Groceries, then click the filter button. That will search the database and rebuild the table only with expenses in the Groceries category. You can also add more filters, like for example search Groceries expenses in the month of October, and so on... The sum of expenses displayed at the end will also be updated to reflect the results of the search.</p>
                                <p>After that, you can click the gray button to search all expenses to go back to the original state without having to refresh it.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100">
                        <div class="card-header">Step 3</div>
                            <div className="card-body">
                                <h5 className="card-title">Edit</h5>
                                <p className="card-text">Each expense in the table has a button at the end which toggles editable options where the you can modify any data, save or discard changes, as well as delete the entire row if you need to make adjustments.</p>
                                <p>In "Manage Types" under the "My Account" menu, it is also possible to also edit types' names and budgets, or delete them if needed. When a type is deleted, all its expenses are automatically assigned to "Other", which is the default type.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100">
                        <div class="card-header">Step 4</div>
                            <div className="card-body">
                                <h5 className="card-title">Categorize</h5>
                                <p className="card-text">Every new account starts with an "Other" type, which cannot be deleted. However, you have the freedom to create and delete as many types of expenses as you wish, as well as assign specific budgets to it by clicking the yellow button in the form. If you choose to add a budget, an email alert will be sent if you reach 70% of your budget, and then you exceed it.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100">
                        <div class="card-header">Step 5</div>
                            <div className="card-body">
                                <h5 className="card-title">Analize</h5>
                                <p className="card-text">The "My Account" link on the navbar takes you to your user menu with a few other features including the option to edit your account information as well as managing your types and budgets. From there, it is possible to analyze a detailed visual summary of all types and  budgets with progress bars and colors to help monitor your expenses. At the bottom of the "Budgets" page, there are also cards displaying the total budget, the amount for expenses inside your budgets, and finally the total amount spent, which includes extra expenses in types that do not have a budget set. You can also compare with previous months by selecting the navigation buttons at the very end for an easy comparison. It fetches the data from different months from the database and updates the diagram.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100">
                        <div class="card-header">Step 6</div>
                            <div className="card-body">
                                <h5 className="card-title">Automate</h5>
                                <p className="card-text">Finally, from the My Account menu, you also have the option to link your bank to automatically fetch transactions processed in your accounts and have them safely and securely added to Finans. New types will be created for transactions obtained according to the category received from your financial institution, but your have the option to change their types in your Dashboard, as well as any other field you wish.</p>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="d-flex justify-content-center my-5">

                    <Link to="/login">
                        <button type="button" data-dismiss="modal" className="btn btn-warning">Start using Finans today!</button>
                    </Link>
                </div>
            </div>
        </div>



    )
}
export default About;

