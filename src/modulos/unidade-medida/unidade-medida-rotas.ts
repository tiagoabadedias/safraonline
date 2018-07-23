import * as express from "express";
import { UnidadeMedidaController } from "../unidade-medida/unidade-medida-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class UnidadeMedidaRotas {
  public express: express.Application;
  public router: express.Router;
  public unidadeMedidaController: UnidadeMedidaController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.unidadeMedidaController = new UnidadeMedidaController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.unidadeMedidaController.getAll);
    this.router.get("/:_id", this.unidadeMedidaController.getOne);
    this.router.get("/buscar/:_nome", this.unidadeMedidaController.searchWithNameUnidadeMedida);
    this.router.post("/", this.unidadeMedidaController.create);
    this.router.put("/:_id", this.unidadeMedidaController.update);
    this.router.delete("/:_id", this.unidadeMedidaController.delete);
  }
}

export default new UnidadeMedidaRotas().router;
