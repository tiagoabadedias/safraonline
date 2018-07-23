import * as express from "express";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";
import { ConsultorController } from "./consultor-controller";

class ConsultorRotas {
  public express: express.Application;
  public router: express.Router;
  public consultorController: ConsultorController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.consultorController = new ConsultorController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.consultorController.getAll);
    this.router.get("/:_id", this.consultorController.getOne);
    this.router.post("/", this.consultorController.create);
    this.router.put("/:_id", this.consultorController.update);
    this.router.delete("/:_id", this.consultorController.delete);
  }
}

export default new ConsultorRotas().router;
