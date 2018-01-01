import * as mocha from 'mocha';
import * as chai from 'chai';
import PlayerType from '../../src/models/PlayerType';
import chaiHttp = require('chai-http');


import server from '../../src/server';
import { KasotiErrorMap, KasotiErrorMsgMap, KasotiError } from '../../src/exception/kasoti_error_map';
import { join } from 'path';

chai.use(chaiHttp);
const expect = chai.expect;

const player = { "name": "test player" };
let playerRes: any;
let gamePlayRes: any;

describe("startGame end point test", () => {
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

    // gameplay not waiting
    it('should get error ' + KasotiErrorMsgMap.e119, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/gid/" + gamePlayRes._id + '/start')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e119;
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

    it('should set game on waiting', (done) => {
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/wait')
            .send(player)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.isWaiting).to.be.true;
                    gamePlayRes = res.body;
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    // gameplay not found
    /* it('should get error ' + KasotiErrorMsgMap.e120, (done) => {
        const fakeGId = "5a34f48af73b0b1f142043fb";
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/gid/" + fakeGId + '/start')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e120;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    }); */

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