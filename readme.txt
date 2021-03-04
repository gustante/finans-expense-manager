

CPSC 2600 Final Project


Description:

Application that serves as an expense tracker. It creates a detailed record of expenses based on information passed.


--

Usage:
It is a very simple and straightforward app. The user can interact with the form fields to add, search, filter and delete transactions that are detailed with month, day, year, year, type, description and amount. There is also a field at the end of the table with the total amount of expenses displayed.

Upon start, the app loads all existing expenses in database and creates a table with the records. The user can then fill all the fields and click the add button to register a new transaction, which will promptly be added to the end of the table along with a success pop-up message with the transaction id. If any field is missing or if incorrect information is passed, such as a year that contains a letter, a error message is displayed and the transaction is not added.

Transaction ID can be typed in the url to access that specific member of the database collection
 
The user and can also dynamically filter expenses based on the information contained in the fields. They can click the button to clear all the fields and then select only type Groceries, then click the filter button. That will search the database and rebuild the table only with expenses in the Groceries category. They can also add more filters, like for example search Groceries expenses in the month of October, and so on... The sum of expenses displayed at the end  will also be updated to reflect the results of the search.

A button to search all expenses was also added to go back to the original state without having to refresh it

Finally, each expense record in the table has a delete button which will remove it from the table and from the database.


--
Installation:
Install dependencies: npm install

--

Run with:
npm start


Developed by:

Gustavo Franca Faria (SID 100344031)

--

Build with:
Bootstrap v4.0
FontAwesome v5.15.1
& All Other tools learned in class

--

References etc: 
This app uses bootstrap and fontawesome as external libraries that are not studied in the course. They are free and public and open-source. 

Fontawesome icons in the buttons were taken from https://fontawesome.com/icons?d=gallery

Bootstrap Modal code templates in line 14 of ModalError.js and ModalSuccess.js were taken from https://getbootstrap.com/docs/4.0/components/modal/

Other bootstrap classes were used randomly throughout the react components to style the page and make it responsive, mobile-friendly, nice and minimal.

Code to toggle modal in line 12 of ModalError.js and ModalSuccess.js was taken from https://www.js-tutorials.com/react-js/how-to-create-modal-box-component-in-react/


Obs: Used 1 post and 1 delete route instead of 2 post as authorized by instructor.

