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
const MAX_QUESTIONER = 4;
let playerRes: any;
let gamePlayRes: any;
let fakeQuestioners: Array<any> = [];

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
            .get('/api/v1/players/' + playerRes._id + '/start')
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

    // error: no. of questioner not set
    it('should get error: ' + KasotiErrorMsgMap.e121, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/start")
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e121;
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

    // error: game conditions do no matched
    it('should get error: ' + KasotiErrorMsgMap.e117, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/start")
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e117;
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

    it("add 4 fake questioner", (done) => {
        // add 4 fake questioner
        for (let i = 1; i <= MAX_QUESTIONER; i++) {
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
                                    if (i === MAX_QUESTIONER) {
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

    // error: game conditions do no matched
    // since answerer not set
    it('should get error: ' + KasotiErrorMsgMap.e117, (done) => {
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/start")
            .end((err, res) => {
                try {
                    let errObj = KasotiErrorMap.e117;
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
    it('should change type to Answerer', (done) => {
        chai.request(server).get('/api/v1/players/' + playerRes._id + '/type/ar')
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

    it('should start game successfully', (done) => {
        chai.request(server)
            .get('/api/v1/players/' + playerRes._id + "/start")
            .end((err, res) => {
                try {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body._id).to.be.string;
                    expect(res.body.isWaiting).to.be.false;
                    expect(res.body.isRunning).to.be.true;
                    expect(res.body.joinedQuestionerCount).to.eql(MAX_QUESTIONER);
                } catch (e) {
                    console.log(e);
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