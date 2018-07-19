import * as express from "express";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";
import { ProdutorController } from "./produtor-controller";

class ProdutorRotas {
  public express: express.Application;
  public router: express.Router;
  public produtorController: ProdutorController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.produtorController = new ProdutorController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    // this.router.use(this.middlewareAuth.checkAuth);
    // this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.produtorController.getAll);
    this.router.get("/:_id", this.produtorController.getOne);
    // this.router.get("/buscar/:_nome", this.produtorController.searchWithNameComponenteCusto);
    this.router.post("/", this.produtorController.create);
    this.router.put("/:_id", this.produtorController.update);
    this.router.delete("/:_id", this.produtorController.delete);
  }
}

export default new ProdutorRotas().router;
