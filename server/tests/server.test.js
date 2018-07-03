const {expect} = require('chai');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {testTodos, testUsers, populateTodos, populateUsers} = require('./seed/seed.js');

//Clear out the database since later in the test we assume that the database is empty
beforeEach(populateTodos);
beforeEach(populateUsers);

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
                expect(todos.length).to.equal(2);
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
            expect(res.body.todos.length).to.equal(2);
        }).end(done);
    });
})

describe('GET /todos/:id', () => {
    it('should return a specific todo by ID', (done) => {
        request(app)
        .get(`/todos/${testTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).to.equal(testTodos[0].text);
        }).end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}`)
        .expect(404)
        .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = testTodos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).to.equal(hexId);
        })
        .end((err, res) => {
            if (err) {
                return done(err);f
            }
            //Query database by id, and expect that the item does not exist, using the to be null expectation
            Todo.findById(hexId).then((todo) => {
                expect(todo).to.be.null;
                done();
            }).catch((e) => done(e));
        });

    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`/todos/whatisthisanidforidiots}`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the text and completed values', (done) => {
        //Grab ID of first item
        let id = testTodos[0]._id.toHexString();

        //Make patch request
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text:"TEST VALUE",
            completed: true
        })
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);f
            }
            //Query database by id, and expect that the item does not exist, using the to not exist assertion
            Todo.findById(id).then((todo) => {
                //Update the text and set it to "TEST VALUE"
                //Set completed to true
                //Assert 200
                //Assert that text is changed
                //Assert that completed is true and that completedAt is a number
                expect(todo.text).to.equal("TEST VALUE");
                expect(todo.completed).to.equal(true);
                expect(todo.completedAt).to.be.a('number');
                done();
            }).catch((e) => done(e));
        });



    });

    it('should clear completedAt when completed is set to false', (done) => {
        //Grab the id of the SECOND todo item
        let id = testTodos[1]._id.toHexString();
                //Make patch request
        request(app)
        .patch(`/todos/${id}`)
        .send({
            text:"SOMETHING DIFFERENT",
            completed: false
        })
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);f
            }
            //Query database by id, and expect that the item does not exist, using the to not exist assertion
            Todo.findById(id).then((todo) => {
                //Update the text to "SOMETHING DIFFERENT"
                //Update the completed to false
                //Assert 200
                //Assert that the text is changed
                //Assert that completed is false, and that completedAt is null
                expect(todo.text).to.equal("SOMETHING DIFFERENT");
                expect(todo.completed).to.equal(false);
                expect(todo.completedAt).to.be.null;
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /users/me', () => {
    it('should return an authenticated user', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).to.equal(testUsers[0]._id.toHexString());
            expect(res.body.email).to.equal(testUsers[0].email);
        })
        .end(done);
    });

    it('should return 401 and nothing else on an unauthenticated user', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).to.be.empty;
        })
        .end(done);
    });

});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'something@email.com';
        var password = 'asdfasdf';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).to.exist;
                expect(res.body.email).to.equal(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);f
                }
                //Query database by id, and expect that the item does not exist, using the to be null expectation
                User.findByToken(res.header['x-auth']).then((user) => {
                    expect(user.email).to.equal(email);
                    expect(user.password).to.not.equal(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if email invalid', (done) => {
        var badEmail = 'bad@email'
        var password = 'asdfasdf'
        request(app)
            .post('/users')
            .send({badEmail, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.email).to.not.exist;
            })
            .end((err, res) => {
                if (err) {
                    return done(err);f
                }
                User.findOne({badEmail}).then((user) => {
                    expect(user).to.not.exist;
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if password invalid', (done) => {
        var email = 'good@email.com';
        var badPass = 'a';
        request(app)
            .post('/users')
            .send({email, password: badPass})
            .expect(400)
            .expect((res) => {
                expect(res.body.email).to.not.exist;
            })
            .end((err, res) => {
                if (err) {
                    return done(err);f
                }
                User.findOne({email}).then((user) => {
                    expect(user).to.not.exist;
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a user if email is in use', (done) => {
        var email = testUsers[0].email;
        var password = testUsers[0].password;
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .expect(res.body.email).to.not.exist
        .end((err, res) => {
            if (err) {
                return done(err);f
            }
            User.find({email}).then((users) => {
                expect(users.length).to.equal(1);
                done();
            }).catch((e) => done(e));
        });
    });

});