import {Router, Request, Response, NextFunction} from 'express';
import GamePlay from  '../models/GamePlay';
import Player from '../models/Player';

export class GamePlayRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    public createOne(req: Request, res: Response, next: NextFunction) {
        // add checks and conditions
        GamePlay.create(req.body).then((gamePlay) => {
            if (gamePlay && gamePlay.initiator) {
                Player.findOneAndUpdate({_id: gamePlay.initiator}, {gamePlay: gamePlay._id}).then(() =>{
                    res.json(gamePlay);
                }).catch(next);
            }

        }).catch(next);
    }



    public routes() {
        this.router.post("/", this.createOne);
    }

}

const gamePlayRouter: GamePlayRouter = new GamePlayRouter();
gamePlayRouter.routes();

export default gamePlayRouter.router;