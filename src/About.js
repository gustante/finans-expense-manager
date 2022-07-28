import React from 'react';
import { Link } from "react-router-dom";

function About() {

    return (



        <div className="dashboard mb-5">
            <div class=" my-2">
                <div class="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <h1 class="display-4">About finans</h1>
                    <p class="lead">Finans is a simple and easy-to-use application to keep your spendings in control. It creates a detailed record of expenses and provides several other tools to help you manage them.</p>
                </div>



                <p>After log ing and upon start, the app loads all existing expenses in the database at the dashboard and creates a table with the records. The user can then fill all the fields and click the add button to register a new transaction, which will promptly be added to the end of the table along with a success pop-up message with the transaction id.  If any field is missing or if incorrect information is passed, such as a year that contains a letter, an error message is displayed and the transaction is not added. Newest expenses are always displayed on top.</p>

                <p>The user can also dynamically filter expenses based on the information contained in the fields. As an example, they can click the button to clear all the fields and then select only type Groceries, then click the filter button. That will search the database and rebuild the table only with expenses in the Groceries category. They can also add more filters, like for example search Groceries expenses in the month of October, and so on... The sum of expenses displayed at the end will also be updated to reflect the results of the search.</p>

                <p>A button to search all expenses was also added to go back to the original state without having to refresh it.</p>

                <p>Each expense in the table has a button at the end which toggles editable options where the user can modify any data, save or discard changes, as well as delete the entire row if needed.</p>

                <p>Every new account starts with an "Other" type, which cannot be deleted. However, the user has the freedom to create and delete as many types of expenses as they wish, as well as assign specific budgets to it by clicking the yellow button in the form. If the user chooses to add a budget, an SMS notification will be sent to their phone alerting them when they reach half of their budget, when it is at 80%, and then they exceed it, as long as they have a phone number registered.</p>

                <p>The "My Account" link on the navbar takes the user to a menu with a few other features including the option to edit their account information as well as manage their types and budgets. From there, it is possible to analyze a detailed visual summary of all types and their budgets with progress bars and colors to help monitor their expenses. At the bottom of the "Budgets" page, there are also cards displaying the total budget, the amount for expenses inside their budgets, and finally the total amount spent, which includes extra expenses in types that do not have a budget set. The user can also compare with previous months by selecting the navigation buttons at the very end for an easy comparison. It fetches the data from different months from the database and updates the diagram.</p>

                <p>In "Manage Types", it is possible to also edit types' names and budgets, or delete them if needed. When a type is deleted, all its expenses are automatically assigned to "Other", which is the default type.</p>

                <p>Every action where user input is provided is protected by reCAPTCHA v3, as well as by extensive front-end and back-end validators and sanitizers which cover updating, creation or deletion of expenses, types and user accounts/personal information. </p>
                
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

