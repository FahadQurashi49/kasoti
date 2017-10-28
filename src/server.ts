import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import playerRouter from './router/PlayerRouter';
import gamePlayRouter from './router/GamePlayRouter';

// Creates and configures an ExpressJS web server.
class Server {

  // ref to Express instance
  public express: express.Application;
  private ERROR_CODE: number = 500;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.config();
    this.routes();
  }

  // application config
  private config(): void {

    // mongo connection
    const MONGO_URI:string = 'mongodb://localhost/kasoti';
    mongoose.connect(MONGO_URI || process.env.mongodb_uri, {useMongoClient: true});
    mongoose.Promise = global.Promise;

    // express middleware
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    this.express.use('/api/v1/players', playerRouter);
    this.express.use('/api/v1/game_play', gamePlayRouter);
    this.express.use((err, req, res, next) => {
      let error = {
        error: err.message,
        errorCode: err.errorCode || this.ERROR_CODE,
        statusCode: err.statusCode || this.ERROR_CODE,
      };
      res.status(error.statusCode).json(error);
    });
  }

}

export default new Server().express;