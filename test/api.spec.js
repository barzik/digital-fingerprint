const request = require('supertest');
const app = require('../app.js');
const sinon = require('sinon');
const connection = require('../api/connection');
const chai = require('chai');
const expect = chai.expect;
let mockCreateConnectionMethod;
let mockQueryMethod;
let mockConnection = {
  connect() { return true; },
  query(arg1, arg2, arg3 = () => { }) {
    arg3(null, [{ name: 'moshe' }]);
  },
};

describe('API test', () => {

  beforeEach(function () {
    mockCreateConnectionMethod = sinon.stub(connection, 'getClient');
    mockCreateConnectionMethod.returns(mockConnection);
    mockQueryMethod = sinon.spy(mockConnection, 'query');
  });
  afterEach(function () {
    mockCreateConnectionMethod.restore();
    mockQueryMethod.restore();
  });

  it('GET /api/:hash should return 200', (done) => {
    request(app)
      .get('/api/testHash')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.equal('moshe');
        expect(mockQueryMethod.calledOnce).to.equal(true);
        done();
      });
  });

  it('POST /api with payload should return 200', (done) => {
    request(app)
      .post('/api')
      .send({ hash: 'TestHash', name: 'Test Name' })
      .expect(200)
      .end(() => {
        expect(mockQueryMethod.calledOnce).to.equal(true);
        expect(mockQueryMethod.calledWith(
          sinon.match.any,
          { hash: 'TestHash', name: 'Test Name' },
          sinon.match.any
        )).to.equal(true);
        done();
      });
  });

});
