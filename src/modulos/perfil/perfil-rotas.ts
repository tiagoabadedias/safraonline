import * as express from "express";
import { PerfilController } from "../../modulos/perfil/perfil-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class PerfilRotas {
  public express: express.Application;
  public router: express.Router;
  public perfilControler: PerfilController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.perfilControler = new PerfilController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.perfilControler.getAll);
    this.router.put("/:_id", this.perfilControler.update);
    this.router.delete("/:_id", this.perfilControler.delete);
  }
}

export default new PerfilRotas().router;
