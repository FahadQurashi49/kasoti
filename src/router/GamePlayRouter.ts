import { Router, Request, Response, NextFunction } from 'express';
import GamePlay from '../models/GamePlay';
import Player from '../models/Player';
import { KasotiError } from '../exception/kasoti_error_map';

export class GamePlayRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    // initiates a game
    public createOne(req: Request, res: Response, next: NextFunction) {
        // TODO: add checks and conditions
        // check initiator is not already a initiator of other game?
        let gamePlayReq: any = req.body;
        GamePlay.find({ initiator: gamePlayReq.initiator }).then((initiatorGamePlays) => {
            if (initiatorGamePlays.length === 0) {
                GamePlay.create(req.body).then((gamePlay) => {
                    // initiator will come in req.body
                    if (gamePlay) {
                        Player.findOneAndUpdate({ _id: gamePlay.initiator }, { gamePlay: gamePlay._id }).then(() => {
                            res.json(gamePlay);
                        }).catch(next);
                    } else {
                        KasotiError.throwError(101);
                    }
                }).catch(next);
            } else {
                KasotiError.throwError(100);
            }

        }).catch(next);

    }

    public updateOne(req: Request, res: Response, next: NextFunction) {
        GamePlay.findOneAndUpdate({ _id: req.params.id }, req.body).then(() => {
            GamePlay.findOne({ _id: req.params.id }).then((player) => {
                res.json(player);
            }).catch(next)
        }).catch(next);
    }


    public deleteOne(req: Request, res: Response, next: NextFunction) {
        GamePlay.findByIdAndRemove({ _id: req.params.id }).then((gamePlay) => {
            res.json(gamePlay);
        }).catch(next);
    }

    //just for development
    public getAll(req: Request, res: Response, next: NextFunction) {
        GamePlay.find({}).then((records) => {
            res.json(records);
        }).catch(next);
    }


    public routes() {
        this.router.get("/", this.getAll);
        this.router.post("/", this.createOne);
        this.router.put("/:id", this.updateOne);
        this.router.delete("/:id", this.deleteOne);
    }

}

const gamePlayRouter: GamePlayRouter = new GamePlayRouter();
gamePlayRouter.routes();

export default gamePlayRouter.router;