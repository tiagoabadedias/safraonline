import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as fs from "fs";
import * as helmet from "helmet";
import * as http from "http";
import * as methodOverride from "method-override";
import { IError } from "./interfaces/error";
import routes from "./routes";
import { sequelize } from "./sequelize";

// tslint:disable-next-line:no-var-requires
const newrelic = require("newrelic");
class App {
  public express: express.Application;
  private server: any;
  private io: any;

  constructor() {
    this.express = express();
    this.middlewares();
    this.initSequelize();
    this.server = http.createServer(this.express);
  }

  private middlewares(): void {
    // body parser config
    this.express.use(bodyParser.json({limit: "50mb"}));
    this.express.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    // method override config
    this.express.use(methodOverride("X-HTTP-Method"));
    this.express.use(methodOverride("X-HTTP-Method-Override"));
    this.express.use(methodOverride("X-Method-Override"));
    this.express.use(methodOverride("_method"));

    // cors config
    this.express.use(
      cors({
      allowedHeaders: ["Content-type", "x-access-token", "Origin", "X-Requested-With", "Content-Type", "Accept"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      origin: ["*",
      "http://localhost:4200"
      ],
      }),
    );

    this.express.use(express.static("public"));

    // helmet config
    this.express.use(helmet.noCache());
    this.express.use(helmet.hidePoweredBy());
    // routes config
    this.express.use(routes);
    // not found handler
    this.express.use(this.notFoundHandler);
    // all error hanlder
    this.express.use(this.errorHandler);

  }

  private notFoundHandler(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): void {
    const err = new Error("Not found");
    next(err);
  }

  private errorHandler(
    err: IError,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): void {
    response.status( err.status || 500 ).json({ error: err.errors || err.message });
  }

  private initSequelize() {
    try {
      const force = false;
      const logging = false;

      sequelize
        .sync({ logging, force })
        .then(() => {
          // tslint:disable-next-line:no-console
          console.log("Sequelize > Synchronized!");
          // caso seja force, repopula os dados iniciais
          // tslint:disable-next-line:no-empty
          if (force) {
          }
        })
        .catch((error) => {
          // tslint:disable-next-line:no-console
          console.log(error);
        });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }
}

export default new App().express;
