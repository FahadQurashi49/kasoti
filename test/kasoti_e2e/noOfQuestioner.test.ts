import * as mocha from 'mocha';
import * as chai from 'chai';
import PlayerType from '../../src/models/PlayerType';
import chaiHttp = require('chai-http');


import server from '../../src/server';
import { KasotiErrorMap, KasotiErrorMsgMap, KasotiError } from '../../src/exception/kasoti_error_map';

chai.use(chaiHttp);
const expect = chai.expect;


const player = { "name": "test player" };
let playerRes: any;
let gamePlayRes: any;

describe('noOfQuestioner end point test', () => {
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
        let gamePlay = { "name": "test game", "initiator": playerRes._id };
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

    it('should get error: ' + KasotiErrorMsgMap.e105, (done) => {
        let noq = 'abc';
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + noq)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e105;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should get error: ' + KasotiErrorMsgMap.e107, (done) => {
        let noq = 4;
        let garbagePlayerId = "59f2319cf687c71d787611f8";
        chai.request(server).get('/api/v1/players/' + garbagePlayerId + '/noq/' + noq)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e107;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should get validation error: maximum 4 questioner allowed', (done) => {
        let noq = 6;
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + noq)
            .end((err, res) => {
                try {
                    expect(res).to.have.status(500);
                    expect(res.body.error).to.contain("maximum 4 questioner allowed");
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should get validation error: atleast one questioner required', (done) => {
        let noq = 0;
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + noq)
            .end((err, res) => {
                try {
                    expect(res).to.have.status(500);
                    expect(res.body.error).to.contain("atleast one questioner required");
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should set noOfQuestioner of game play to 4', (done) => {
        let noq = 4;
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + noq)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.noOfQuestioner).to.eql(noq);
                    gamePlayRes = res.body;
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should set noOfQuestioner of game play to 2', (done) => {
        let noq = 4;
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + noq)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.noOfQuestioner).to.eql(noq);
                    gamePlayRes = res.body;
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should set isRunning true of gamePlay', (done) => {
        let endPoint = '/api/v1/game_play/' + gamePlayRes._id;
        let testGamePlay = {isRunning: true};
        chai.request(server).put(endPoint)
            .send(testGamePlay)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body.isRunning).to.eql(true);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should get error: ' + KasotiErrorMsgMap.e106, (done) => {
        let noq = 3;
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + noq)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e106;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
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