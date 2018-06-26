const {expect} = require('chai');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const testTodos = [
    {text: 'First todo'},
    {text: 'Second todo'},
    {text: 'Third todo'}
];

//Clear out the database since later in the test we assume that the database is empty
beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(testTodos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Todo test text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).to.equal(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).to.equal(1);
                expect(todos[0].text).to.equal(text);
                done();
            }).catch((e) => {done(e)});
            //from supertest npm docs:
            //If you are using the .end() method .expect() assertions that fail will not throw - 
            //they will return the assertion as an error to the .end() callback.
            //In order to fail the test case, you will need to rethrow or pass err to done(), as follows:

            //What this means is that the Todo.find().then(...) code will only run if the all the request stuff
            //went through without an error. ie (err) == false.
            //Then because the assertions within this block might throw their own errors, a catch function is added
            //in order to call the done function to recognize the error. If no exceptions are thrown, then done is
            //called without any arguments.
        });
    });

    it('should not create a todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .expect((res) => {

        }).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).to.equal(3);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should return all of the todos in an array', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).to.equal(3);
        }).end(done);
    });
})