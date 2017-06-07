const request = require('supertest');
const app = require('../app.js');
const sinon = require('sinon');
const mysql = require('mysql');
const chai = require('chai');
const expect = chai.expect;
let mockCreateConnectionMethod;
let mockConnectMethod;
let mockQueryMethod;
let mockConnection = {
  connect() { return true; },
  query(arg1, arg2, arg3 = () => { }) {
    arg3(null, [{ name: 'moshe' }]);
  },
};

describe('API test', () => {

  beforeEach(function () {
    mockCreateConnectionMethod = sinon.stub(mysql, 'createConnection');
    mockCreateConnectionMethod.returns(mockConnection);
    mockConnectMethod = sinon.spy(mockConnection, 'connect');
    mockQueryMethod = sinon.spy(mockConnection, 'query');
  });
  afterEach(function () {
    mockCreateConnectionMethod.restore();
    mockConnectMethod.restore();
    mockQueryMethod.restore();
  });

  it('GET /api/:hash should return 200', (done) => {
    request(app)
      .get('/api/testHash')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.equal('moshe');
        expect(mockConnectMethod.calledOnce).to.equal(true);
        expect(mockQueryMethod.calledTwice).to.equal(true);
        done();
      });
  });

  it('POST /api with payload should return 200', (done) => {
    request(app)
      .post('/api')
      .send({ hash: 'TestHash', name: 'Test Name' })
      .expect(200)
      .end(() => {
        //sinon.match.any
        expect(mockConnectMethod.calledOnce).to.equal(true);
        expect(mockQueryMethod.calledTwice).to.equal(true);
        expect(mockQueryMethod.calledWith(
          sinon.match.any,
          { hash: 'TestHash', name: 'Test Name' },
          sinon.match.any
        )).to.equal(true);
        done();
      });
  });

});
