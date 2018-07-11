import * as express from "express";
import { ComponenteCustoProducaoController } from "../componente-custo-producao/componente-custo-producao-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class ComponenteCustoProducaoRotas {
  public express: express.Application;
  public router: express.Router;
  public componenteCustoProducaoController: ComponenteCustoProducaoController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.componenteCustoProducaoController = new ComponenteCustoProducaoController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    // this.router.use(this.middlewareAuth.checkAuth);
    // this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.componenteCustoProducaoController.getAll);
    this.router.get("/:_id", this.componenteCustoProducaoController.getOne);
    this.router.post("/", this.componenteCustoProducaoController.create);
    this.router.put("/:_id", this.componenteCustoProducaoController.update);
    this.router.delete("/:_id", this.componenteCustoProducaoController.delete);
  }
}

export default new ComponenteCustoProducaoRotas().router;
