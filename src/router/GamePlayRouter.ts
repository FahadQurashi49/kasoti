import { Router, Request, Response, NextFunction } from 'express';
import GamePlay from '../models/GamePlay';
import Player from '../models/Player';

export class GamePlayRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    public createOne(req: Request, res: Response, next: NextFunction) {
        // TODO: add checks and conditions
        GamePlay.create(req.body).then((gamePlay) => {
            if (gamePlay && gamePlay.initiator) {
                Player.findOneAndUpdate({ _id: gamePlay.initiator }, { gamePlay: gamePlay._id }).then(() => {
                    res.json(gamePlay);
                }).catch(next);
            }

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
    }

}

const gamePlayRouter: GamePlayRouter = new GamePlayRouter();
gamePlayRouter.routes();

export default gamePlayRouter.router;