import axios from 'axios'
import { Server } from 'http';
import url from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';

const Expense = require('../models/Expense.js');
const Type = require('../models/Type.js');


describe('Expense creation test', () => {
    let mongoServer: any;
    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        process.env.MONGODBURI = await mongoServer.getUri();
    });

    afterAll(async () => {
        await mongoServer.stop();
    });


    it('Load expenses', async () => {
        const ListOfExpenses = await Expense.find({}).exec()

        expect(ListOfExpenses.data).toBeTruthy();
    });

    it('create expenses', async () => {
        const typeChosen = await Type.findOne({ "name": 'Groceries' }).exec()

        let expenseCreated = await new Expense({
            month: 3,
            day: 16,
            year: 2015,
            type: typeChosen,//reference to type schema
            description: 'Superstore',
            amount: 143,
        });

        expect(expenseCreated.data).not.toBeUndefined();
        expect(expenseCreated.data.description).toBe('Superstore')
    });

    it('create expenses without amount and type', async () => {

        await expect(async () => {
            let expenseCreated = await new Expense({
                month: 3,
                day: 16,
                year: 2015,
                description: 'Superstore',
            });

        }).rejects.toThrow();
    });







});