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
const newPlayer  = {"name": "test player 2"};
let playerRes: any;
let newPlayerRes: any;
let gamePlayRes: any;

describe('joinGame end point test', () => {
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

    it('should create new player', (done) => {
        chai.request(server).post('/api/v1/players')
            .send(newPlayer)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    newPlayerRes = res.body;
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should join game as Questioner', (done) => {
        chai.request(server)
        .get('/api/v1/players/' + newPlayerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
        .send(player)
        .end((err, res) => {
            try {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.type).to.eql('application/json');
                expect(res.body._id).to.be.string;
                expect(res.body.playerType).to.eql(PlayerType.QUESTIONER);
                expect(res.body.gamePlay).to.eql(gamePlayRes._id);
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

    it('should delete new player', (done) => {
        chai.request(server)
            .del('/api/v1/players/' + newPlayerRes._id)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.eql(newPlayerRes._id);
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