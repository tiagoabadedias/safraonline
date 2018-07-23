import * as express from "express";
import { SistemaCultivoController } from "../sistema-cultivo/sistema-cultivo-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class UsuarioRotas {
  public express: express.Application;
  public router: express.Router;
  public sistemaCultivoController: SistemaCultivoController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.sistemaCultivoController = new SistemaCultivoController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.sistemaCultivoController.getAll);
    this.router.get("/:_id", this.sistemaCultivoController.getOne);
    this.router.get("/buscar/:_nome", this.sistemaCultivoController.searchWithNameSistemaCultivo);
    this.router.post("/", this.sistemaCultivoController.create);
    this.router.put("/:_id", this.sistemaCultivoController.update);
    this.router.delete("/:_id", this.sistemaCultivoController.delete);
  }
}

export default new UsuarioRotas().router;
