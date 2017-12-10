import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import server from '../src/server';
import { KasotiErrorMap, KasotiErrorMsgMap } from '../src/exception/kasoti_error_map';

chai.use(chaiHttp);
const expect = chai.expect;

const player = { "name": "test player" };
let playerRes: any;
let gamePlayRes: any;

describe('gamePlay test', () => {

    it('should create one player', (done) => {
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

    it('should initiate game', (done) => {
        let gamePlay = {"name": "test game", "initiator": playerRes._id};
        chai.request(server).post('/api/v1/game_play')
        .send(gamePlay)
        .end((err, res) => {
            try {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body._id).to.be.string;
                expect(res.body.initiator).to.eql(playerRes._id);
                gamePlayRes = res.body;
            } catch (e) {
                console.error(e);
            } finally {
                done();
            }
        });
    });

    it('should get error: ' + KasotiErrorMsgMap.e100 , (done) => {
        let gamePlay = {"name": "test game 2", "initiator": playerRes._id};
        chai.request(server).post('/api/v1/game_play')
        .send(gamePlay)
        .end((err, res) => {
            try {
                let errorObj = KasotiErrorMap.e100;
                expect(res).to.have.status(errorObj.statusCode);
                expect(res.body.error).to.eql(errorObj.message);
                expect(res.body.errorCode).to.eql(errorObj.errorCode);
            } catch (e) {
                console.error(e);
            } finally {
                done();
            }
        });
    });

    it('should get initiator validation error', (done) => {
        let gamePlay = {"name": "test game 3"};
        chai.request(server).post('/api/v1/game_play')
        .send(gamePlay)
        .end((err, res) => {
            try {                
                expect(res).to.have.status(500);
                expect(res.body.error).to.eql("game_play validation failed: initiator: initiator is required");
                expect(res.body.errorCode).to.eql(500);
            } catch (e) {
                console.error(e);
            } finally {
                done();
            }
        });
    });

    it('should delete gamePlay', (done) => {
        chai.request(server)
          .del('/api/v1/game_play/' + gamePlayRes._id)
          .end((err, res) => {
            try {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.type).to.eql('application/json');
              expect(res.body._id).to.eql(gamePlayRes._id);
            } catch (e) {
              console.error(e);
            } finally {
              done();
            }
    
          });
      });

      it('should delete player', (done) => {
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