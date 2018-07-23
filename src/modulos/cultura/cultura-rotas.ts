import * as express from "express";
import { CulturaController } from "../cultura/cultura-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class CulturaRotas {
  public express: express.Application;
  public router: express.Router;
  public culturaController: CulturaController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.culturaController = new CulturaController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.culturaController.getAll);
    this.router.get("/:_id", this.culturaController.getOne);
    this.router.get("/buscar/:_nome", this.culturaController.searchWithNameCultura);
    this.router.post("/", this.culturaController.create);
    this.router.put("/:_id", this.culturaController.update);
    this.router.delete("/:_id", this.culturaController.delete);
  }
}

export default new CulturaRotas().router;
