import * as express from "express";
import { ComponenteCustoController } from "../componente-custo/componente-custo-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class ComponenteCustoRotas {
  public express: express.Application;
  public router: express.Router;
  public componenteCustoController: ComponenteCustoController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.componenteCustoController = new ComponenteCustoController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.componenteCustoController.getAll);
    this.router.get("/:_id", this.componenteCustoController.getOne);
    this.router.get("/buscar/:_nome", this.componenteCustoController.searchWithNameComponenteCusto);
    this.router.post("/", this.componenteCustoController.create);
    this.router.put("/:_id", this.componenteCustoController.update);
    this.router.delete("/:_id", this.componenteCustoController.delete);
  }
}

export default new ComponenteCustoRotas().router;
