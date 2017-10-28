import {Router, Request, Response, NextFunction} from 'express';
import Player from  '../models/Player';

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

    public getOne(req: Request, res: Response, next: NextFunction) {
        Player.findById(req.params.id).then((player) => {
            res.json(player);
        }).catch(next);
    }

    public updateOne(req: Request, res: Response, next: NextFunction){
        Player.findOneAndUpdate({_id: req.params.id}, req.body).then(() => {
            Player.findOne({_id: req.params.id}).then((player)=> {
                res.json(player);
            }).catch(next)
        }).catch(next);
    }

    public deleteOne(req: Request, res: Response, next: NextFunction){
        Player.findByIdAndRemove({_id: req.params.id}).then((player)=> {
            res.json(player);
        }).catch(next);
    }


    public routes() {
        this.router.post("/", this.createOne);
        this.router.get("/:id", this.getOne);
        this.router.put("/:id", this.updateOne);
        this.router.delete("/:id", this.deleteOne);
    }

}

const playerRouter = new PlayerRouter();
playerRouter.routes();

export default playerRouter.router;