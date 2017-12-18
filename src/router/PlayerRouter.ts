import { Router, Request, Response, NextFunction } from 'express';
import Player from '../models/Player';
import PlayerType from '../models/PlayerType';
import GamePlay from '../models/GamePlay';
import { KasotiError } from '../exception/kasoti_error_map';

export class PlayerRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    public createOne(req: Request, res: Response, next: NextFunction) {
        Player.create(req.body).then((player) => {
            res.json(player);
        }).catch(next);
    }
    // just for development
    public getAll(req: Request, res: Response, next: NextFunction) {
        Player.find({}).then((players) => {
            res.json(players);
        }).catch(next);
    }

    public getOne(req: Request, res: Response, next: NextFunction) {
        Player.findById(req.params.id).then((player) => {
            res.json(player);
        }).catch(next);
    }

    public updateOne(req: Request, res: Response, next: NextFunction) {
        Player.findOneAndUpdate({ _id: req.params.id }, req.body).then(() => {
            Player.findOne({ _id: req.params.id }).then((player) => {
                res.json(player);
            }).catch(next)
        }).catch(next);
    }

    public deleteOne(req: Request, res: Response, next: NextFunction) {
        Player.findByIdAndRemove({ _id: req.params.id }).then((player) => {
            res.json(player);
        }).catch(next);
    }

    // business logic

    public changeType(req: Request, res: Response, next: NextFunction) {
        Player.findById(req.params.id).then((player) => {
            GamePlay.findById(player.gamePlay).then((gamePlay) => {
                if (gamePlay) {
                    if (!gamePlay.isRunning) {
                        switch (req.params.type) {
                            case "qr":
                                player.playerType = PlayerType.QUESTIONER;
                                break;
                            case "ar":
                                player.playerType = PlayerType.ANSWERER;
                                break;
                            default:
                                KasotiError.throwError(104);
                                return;
                        }

                        player.save().then((savedPlayer) => {
                            res.json(savedPlayer);
                        }).catch(next);
                    } else KasotiError.throwError(103); //cannot change type while in a running game play
                } else KasotiError.throwError(102);     //not in a gameplay
            }).catch(next);

        }).catch(next);
    }

    // this is here to make sure this operation is done by 
    // the initiator of the game, which is a Player
    public setNoOfQuestioner(req: Request, res: Response, next: NextFunction) {
        GamePlay.findOne({ initiator: req.params.id })
            .then((gamePlay) => {
                if (gamePlay) {
                    if (!gamePlay.isRunning) {
                        let noq = parseInt(req.params.noq);
                        if (!isNaN(noq)) {
                            gamePlay.noOfQuestioner = noq;
                            gamePlay.save().then((savedGamePlay) => {
                                res.json(savedGamePlay);
                            }).catch(next);
                        } else KasotiError.throwError(105);   // a number is required
                    } else KasotiError.throwError(106);       // game play not found
                } else KasotiError.throwError(107);           // cannot set noq while in a running game play
            }).catch(next);
    }

    public setGameWaiting(req: Request, res: Response, next: NextFunction) {
        GamePlay.findOne({ initiator: req.params.id }).then((gamePlay) => {
            if (gamePlay) {
                gamePlay.isWaiting = true;
                gamePlay.save().then((savedGamePlay) => {
                    res.json(savedGamePlay);
                }).catch(next);
            } else {
                // TODO: handle error
                // gameplay not found
                res.json(null);
                return;
            }
        }).catch(next);
    }

    public joinGame(req: Request, res: Response, next: NextFunction) {
        Player.findById({ _id: req.params.id }).then((player) => {
            if (player) {
                if (!player.gamePlay) {
                    GamePlay.findById({ _id: req.params.g_id }).then((gamePlay) => {
                        if (gamePlay) {
                            if (!gamePlay.isRunning) {
                                if (gamePlay.isWaiting) {
                                    if (gamePlay.noOfQuestioner) {
                                        switch (req.params.type) {
                                            case "qr":
                                                Player.count({ gamePlay: req.params.g_id, playerType: PlayerType.QUESTIONER }).then((count) => {
                                                    if (count === gamePlay.noOfQuestioner) {
                                                        KasotiError.throwError(108);    // no room for new questioner
                                                    } else {
                                                        player.gamePlay = req.params.g_id;
                                                        player.playerType = PlayerType.QUESTIONER;
                                                        player.save().then((savedPlayer) => {
                                                            res.json(savedPlayer);
                                                        }).catch(next);
                                                    }
                                                }).catch(next);
                                                break;
                                            case "ar":
                                                Player.count({ gamePlay: req.params.g_id, playerType: PlayerType.ANSWERER }).then((count) => {
                                                    if (count > 0) {
                                                        KasotiError.throwError(109);    // no room for new answerer
                                                    } else {
                                                        player.gamePlay = req.params.g_id;
                                                        player.playerType = PlayerType.ANSWERER;
                                                        player.save().then((savedPlayer) => {
                                                            res.json(savedPlayer);
                                                        }).catch(next);
                                                    }
                                                }).catch(next);

                                                break;
                                            default:
                                                KasotiError.throwError(110);    // player type not identified
                                                break;
                                        }
                                    } else {
                                        KasotiError.throwError(116);    // no of questioner not set
                                    }
                                } else {
                                    KasotiError.throwError(111);    // gameplay not waiting
                                }
                            } else {
                                KasotiError.throwError(112);    // gameplay already running
                            }
                        } else {
                            KasotiError.throwError(113);    // gameplay not found
                        }
                    }).catch(next);
                } else {
                    KasotiError.throwError(114);    // player already in a gameplay
                }

            } else {
                KasotiError.throwError(115);    // player not found
            }

        }).catch(next);
    }

    public startGame(req: Request, res: Response, next: NextFunction) {
        GamePlay.findOne({ initiator: req.params.id }).then((gamePlay) => {
            if (gamePlay) {
                if (gamePlay.isWaiting) {
                    if (!gamePlay.isRunning) {
                        Player.count({ gamePlay: req.params.g_id, playerType: PlayerType.QUESTIONER }).then((questionerCount) => {
                            Player.count({ gamePlay: req.params.g_id, playerType: PlayerType.ANSWERER }).then((answererCount) => {
                                if (questionerCount > 0 && questionerCount <= gamePlay.noOfQuestioner && answererCount === 1) {
                                    gamePlay.isWaiting = false;
                                    gamePlay.isRunning = true;
                                    gamePlay.joinedQuestionerCount = questionerCount;
                                    gamePlay.save().then((savedGamePlay) => {
                                        res.json(savedGamePlay);
                                    }).catch(next);
                                } else {
                                    // TODO: handle error
                                    // wait again
                                    res.json("can't start game!");
                                }
                            }).catch(next);
                        }).catch(next);

                    } else {
                        // TODO: handle error
                        res.json("gameplay already running");
                    }
                } else {
                    // TODO: handle error
                    res.json("gameplay not waiting");
                }
            } else {
                // TODO: handle error
                res.json("gameplay not found");
            }
        }).catch(next);
    }

    public routes() {
        this.router.post("/", this.createOne);
        this.router.get("/", this.getAll);
        this.router.get("/:id", this.getOne);
        this.router.put("/:id", this.updateOne);
        this.router.delete("/:id", this.deleteOne);

        this.router.get("/:id/type/:type", this.changeType);
        this.router.get("/:id/noq/:noq", this.setNoOfQuestioner);
        this.router.get("/:id/wait", this.setGameWaiting);
        this.router.get("/:id/type/:type/gid/:g_id/join", this.joinGame);
        this.router.get("/:id/gid/:g_id/start", this.startGame);
    }

}

const playerRouter = new PlayerRouter();
playerRouter.routes();

export default playerRouter.router;