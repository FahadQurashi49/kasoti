import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import server from '../src/server';

chai.use(chaiHttp);
const expect = chai.expect;

const player = { "name": "test player" };
let playerRes: any;

describe('player test', () => {

  it('should create one', (done) => {
    chai.request(server).post('/api/v1/players')
      .send(player)
      .end((err, res) => {
        try {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.type).to.eql('application/json');
          expect(res.body._id).to.be.string;
          playerRes = res.body;
        } catch (e) {
          console.error(e);
        } finally {
          done();
        }
      });
  });

  it('should get one', (done) => {
    chai.request(server)
      .get('/api/v1/players/' + playerRes._id)
      .end((err, res) => {
        try {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.type).to.eql('application/json');
          expect(res.body.name).to.eql(player.name);
        } catch (e) {
          console.error(e);
        } finally {
          done();
        }

      });
  });

  it('should update one', (done) => {
    chai.request(server)
      .put('/api/v1/players/' + playerRes._id)
      .send({ "name": "fahad" })
      .end((err, res) => {
        try {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.type).to.eql('application/json');
          expect(res.body.name).to.eql("fahad");
        } catch (e) {
          console.error(e);
        } finally {
          done();
        }

      });
  });

  it('should delete one', (done) => {
    chai.request(server)
      .del('/api/v1/players/' + playerRes._id)
      .end((err, res) => {
        try {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.type).to.eql('application/json');
          expect(res.body._id).to.eql(playerRes._id);
        } catch (e) {
          console.error(e);
        } finally {
          done();
        }

      });
  });

});