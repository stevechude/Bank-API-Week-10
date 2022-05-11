import { send } from "process";
import request from "supertest";
import app from '../src/app';

//const request = supertest(app);

describe('GET API TESTS', () => {
    test('should return a statuscode 200 for an empty account database', async () => {
        const output = await request(app).get('/balance')
        .set('Content-Type', 'application/json');

        expect(output.statusCode).toBe(200);
        expect(output.body).toEqual([]);
    });
});

describe('GET /balance/accountNumber', ()=> {
    test('should return status 404 for wrong url input', async () => {
        const output = await request(app).get('/balance/:acc')
        .set('Content-Type', 'application/json');
        expect(output.statusCode).toBe(404);
    })
});

describe('POST /transaction', () => {
    test('should create a new account and return 200', async () => {
        const output = await request(app)
        .post("/balance")
        .set('Content-Type', 'application/json')
        .send({
            'balance': 5000
        })
        expect(output.statusCode).toBe(200);
        expect(output.body.acc_number).toBeDefined()
        expect(output.body.balance).toBeDefined()
        expect(output.body.createdAt).toBeDefined()
    });
})

describe('POST /transaction', () => {
    it('should return a status 400 if no transaction has gone through', async ()=> {
        const output = await request(app)
        .post('/transaction')
        .set('Content-Type', 'application/json')
        expect(output.statusCode).toBe(404);
        expect(output.body.status).toBeDefined()
        expect(output.body.message).toBeDefined()
    });
})