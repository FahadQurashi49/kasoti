import * as mocha from 'mocha';
import * as chai from 'chai';
import PlayerType from '../../src/models/PlayerType';
import chaiHttp = require('chai-http');


import server from '../../src/server';
import { KasotiErrorMap, KasotiErrorMsgMap, KasotiError } from '../../src/exception/kasoti_error_map';
import { endianness } from 'os';

chai.use(chaiHttp);
const expect = chai.expect;


const player = { "name": "test player" };
let playerRes: any;
let gamePlayRes: any;

describe('changeType end point test', () => {
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
    // error: not in a gameplay
    it('should get error: ' + KasotiErrorMsgMap.e102, (done) => {
        let endPoint = '/api/v1/players/' + playerRes._id + '/type/qr';
        chai.request(server).get(endPoint)
            .end((err, res) => {
                try {
                    let e102 = KasotiErrorMap.e102;
                    expect(res).to.have.status(e102.statusCode);
                    expect(res.body.errorCode).to.eql(e102.errorCode);
                    expect(res.body.statusCode).to.eql(e102.statusCode);
                    expect(res.body.error).to.eql(e102.message);
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

    // changeType logic


    it('should change type of player to ' + PlayerType.QUESTIONER, (done) => {
        let endPoint = '/api/v1/players/' + playerRes._id + '/type/qr';
        chai.request(server).get(endPoint)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.playerType).to.eql(PlayerType.QUESTIONER);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should change type of player to ' + PlayerType.ANSWERER, (done) => {
        let endPoint = '/api/v1/players/' + playerRes._id + '/type/ar';
        chai.request(server).get(endPoint)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.playerType).to.eql(PlayerType.ANSWERER);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });
    // error: unrecognized type
    it('should get error ' + KasotiErrorMsgMap.e104, (done) => {
        let endPoint = '/api/v1/players/' + playerRes._id + '/type/abc';
        chai.request(server).get(endPoint)
            .end((err, res) => {
                try {
                    let e104 = KasotiErrorMap.e104;
                    expect(res).to.have.status(e104.statusCode);
                    expect(res.body.errorCode).to.eql(e104.errorCode);
                    expect(res.body.statusCode).to.eql(e104.statusCode);
                    expect(res.body.error).to.eql(e104.message);
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
    // error: cannot change type while in a running game play
    it('should get error ' + KasotiErrorMsgMap.e103, (done) => {
        let endPoint = '/api/v1/players/' + playerRes._id + '/type/qr';
        chai.request(server).get(endPoint)
            .end((err, res) => {
                try {
                    let e103 = KasotiErrorMap.e103;
                    expect(res).to.have.status(e103.statusCode);
                    expect(res.body.errorCode).to.eql(e103.errorCode);
                    expect(res.body.statusCode).to.eql(e103.statusCode);
                    expect(res.body.error).to.eql(e103.message);
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