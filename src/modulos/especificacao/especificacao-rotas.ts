import * as express from "express";
import { EspecificacaoController } from "../especificacao/especificacao-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class EspecificacaoRotas {
  public express: express.Application;
  public router: express.Router;
  public especificacaoController: EspecificacaoController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.especificacaoController = new EspecificacaoController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.especificacaoController.getAll);
    this.router.get("/:_id", this.especificacaoController.getOne);
    this.router.get("/buscar/:_nome", this.especificacaoController.searchWithNameEspecificacao);
    this.router.post("/", this.especificacaoController.create);
    this.router.put("/:_id", this.especificacaoController.update);
    this.router.delete("/:_id", this.especificacaoController.delete);
  }
}

export default new EspecificacaoRotas().router;
