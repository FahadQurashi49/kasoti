import { Router, Request, Response, NextFunction } from 'express';
import Player from '../models/Player';
import PlayerType from '../models/PlayerType';
import GamePlay from '../models/GamePlay';

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

    // TODO: if player in a running game it should not change type
    public changeType(req: Request, res: Response, next: NextFunction) {
        Player.findById(req.params.id).then((player) => {
            if (!player.gamePlay) {
                 // not in a gameplay
                 // TODO: send error object
                 res.json(null);
                 return;
            }
            switch(req.params.type) {
                case "qr":
                    player.playerType = PlayerType.QUESTIONER;
                    break;
                case "ar":
                    player.playerType = PlayerType.ANSWERER;
                    break;
                default:
                    // TODO: send error object
                    res.json(null);
                    return;
            }

            player.save().then((savedPlayer) => {
                res.json(savedPlayer);
            }).catch(next);
        }).catch(next);
    }

    // this is here to make sure this operation is done by 
    // the initiator of the game, which is a Player
    // TODO: if player in a running game it should not change type
    public setNoOfQuestioner(req: Request, res: Response, next: NextFunction) {
        GamePlay.findOne({ initiator: req.params.id })            
            .then((gamePlay) => {
                if (gamePlay) {
                    let noq = parseInt(req.params.noq);
                    if (!isNaN(noq)) {                    
                        gamePlay.noOfQuestioner = noq;
                        gamePlay.save().then((savedGamePlay) => {
                            res.json(savedGamePlay);
                        }).catch(next);
                    } else {
                        // TODO: handle error
                        // number is required
                        res.json(null);
                        return;
                    }
                } else {
                    // TODO: handle error
                    // gameplay not found
                    res.json(null);
                    return;
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
    }

}

const playerRouter = new PlayerRouter();
playerRouter.routes();

export default playerRouter.router;