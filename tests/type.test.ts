import axios from 'axios'
import { Server } from 'http';
import url from 'url';
import { MongoMemoryServer } from 'mongodb-memory-server';

const Type = require('../models/Type.js');


describe('Type creation test', () => {
    let mongoServer: any;
    beforeAll(async () => {
        mongoServer = new MongoMemoryServer();
        process.env.MONGODBURI = await mongoServer.getUri();
    });

    afterAll(async () => {
        await mongoServer.stop();
    });


    it('Load types', async () => {
        const ListOfTypes = await Type.find({}).exec()

        expect(ListOfTypes.data).toBeTruthy();
    });

    it('create types', async () => {

        let typeCreated = await new Type({
            name: 'Groceries',
        });

        expect(typeCreated.data).not.toBeUndefined();
        expect(typeCreated.data.name).toBe('Groceries')
    });

    it('create type without a name', async () => {
        await expect(async () => {
            let typeCreated = await new Type({});
        }).rejects.toThrow();
    });







});