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
const newPlayer = { "name": "test player 2" };
const fakePlayer = { "name": "test player 3" };
const MAX_QUESTIONER = 4;
const MAX_ANSWERER = 1;
let playerRes: any;
let newPlayerRes: any;
let fakePlayerRes: any;
let fakeQuestioners: Array<any> = [];
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

    it('should create fake player', (done) => {
        chai.request(server).post('/api/v1/players')
            .send(fakePlayer)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    fakePlayerRes = res.body;
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    it('should change type to Answerer', (done) => {
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/type/ar')
            .send(player)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.playerType).to.eql(PlayerType.ANSWERER);
                    playerRes = res.body;
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

    // error: no. of questioner not set
    it('should get error: ' + KasotiErrorMsgMap.e116, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e116;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
                } catch (e) {
                    console.log(e);
                } finally {
                    done();
                }
            });
    });

    it('should set no. of Questioner to ' + MAX_QUESTIONER, (done) => {
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/noq/' + MAX_QUESTIONER)
            .send(player)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.noOfQuestioner).to.eql(MAX_QUESTIONER);
                    gamePlayRes = res.body;
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });


    // should successfully join game
    it('should join game as Questioner', (done) => {
        chai.request(server)
            .get('/api/v1/players/' + newPlayerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
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

    // testing all error cases
    // no room for new questioner
    it("add 3 fake questioner", (done) => {
        // add 3 fake questioner
        for (let i = 1; i < MAX_QUESTIONER; i++) {
            const fakeQuestioner = { "name": "fake player " + i };
            let fakeQuestionerRes: any;
            chai.request(server).post('/api/v1/players')
                .send(fakeQuestioner)
                .end((err, res) => {
                    try {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.type).to.eql('application/json');
                        expect(res.body._id).to.be.string;
                        fakeQuestionerRes = res.body;
                        fakeQuestioners.push(fakeQuestionerRes);
                        chai.request(server)
                            .get('/api/v1/players/' + fakeQuestionerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
                            .end((err, res) => {
                                try {
                                    expect(err).to.be.null;
                                    expect(res).to.have.status(200);
                                    expect(res.type).to.eql('application/json');
                                    expect(res.body._id).to.be.string;
                                    expect(res.body.playerType).to.eql(PlayerType.QUESTIONER);
                                    expect(res.body.gamePlay).to.eql(gamePlayRes._id);
                                    if ((i + 1) === MAX_QUESTIONER) {
                                        done();
                                    }
                                } catch (e) {
                                    console.log(e);
                                    done();
                                }

                            });
                    } catch (e) {
                        console.log(e);
                        done();
                    }

                });
        }
    });

    it('should get error: ' + KasotiErrorMsgMap.e108, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e108;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
                } catch (e) {
                    console.log(e);
                } finally {
                    done();
                }
            });
    });

    it('should get error: ' + KasotiErrorMsgMap.e109, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/ar/gid/" + gamePlayRes._id + '/join')
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e109;
                    expect(res).to.have.status(errObj.statusCode);
                    expect(res.body.error).to.eql(errObj.message);
                    expect(res.body.errorCode).to.eql(errObj.errorCode);
                } catch (e) {
                    console.log(e);
                } finally {
                    done();
                }
            });
    });

    // player not found
    it('should get error ' + KasotiErrorMsgMap.e115, (done) => {
        const fakeId = "5a34f1c3842a4d11c08aec2e";
        chai.request(server)
            .get('/api/v1/players/' + fakeId + "/type/qr/gid/" + gamePlayRes._id + '/join')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e115;
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

    // player already in a gameplay
    it('should get error ' + KasotiErrorMsgMap.e114, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e114;
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

    // gameplay not found
    it('should get error ' + KasotiErrorMsgMap.e113, (done) => {
        const fakeGId = "5a34f48af73b0b1f142043fb";
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/qr/gid/" + fakeGId + '/join')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e113;
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
    // player type not identified
    it('should get error ' + KasotiErrorMsgMap.e110, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/abc/gid/" + gamePlayRes._id + '/join')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e110;
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

    it('should set isWaiting false of gamePlay', (done) => {
        let endPoint = '/api/v1/game_play/' + gamePlayRes._id;
        let testGamePlay = { isWaiting: false };
        chai.request(server).put(endPoint)
            .send(testGamePlay)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body.isWaiting).to.eql(false);
                } catch (e) {
                    console.error(e);
                } finally {
                    done();
                }
            });
    });

    // gameplay not waiting
    it('should get error ' + KasotiErrorMsgMap.e111, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e111;
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

    it('should set isRunning true of gamePlay', (done) => {
        let endPoint = '/api/v1/game_play/' + gamePlayRes._id;
        let testGamePlay = { isRunning: true };
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

    // gameplay already running
    it('should get error ' + KasotiErrorMsgMap.e112, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + fakePlayerRes._id + "/type/qr/gid/" + gamePlayRes._id + '/join')
            .send(player)
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e112;
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

    it('should delete all fake questioners', (done) => {
        for (let i = 0; i < fakeQuestioners.length; i++) {
            let questioner = fakeQuestioners[i];
            chai.request(server)
                .del('/api/v1/players/' + questioner._id)
                .end((err, res) => {
                    try {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.type).to.eql('application/json');
                        expect(res.body._id).to.eql(questioner._id);
                        if ((i+1) === fakeQuestioners.length) {
                            done();
                        }
                    } catch (e) {
                        console.error(e);
                        done();
                    }

                });
        }
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

    it('should delete fake player', (done) => {
        chai.request(server)
            .del('/api/v1/players/' + fakePlayerRes._id)
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.eql(fakePlayerRes._id);
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