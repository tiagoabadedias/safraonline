import * as express from "express";
import { UsuarioController } from "../usuario/usuario-controller";
import { MiddlewareAuth } from "./../../middlewares/middleware-auth";

class UsuarioRotas {
  public express: express.Application;
  public router: express.Router;
  public usuarioController: UsuarioController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.usuarioController = new UsuarioController();
    this.middlewareAuth = new MiddlewareAuth();
    this.middlewares();
    this.initRoutes();
  }

  private middlewares(): void {
    this.router.use(this.middlewareAuth.checkAuth);
    this.router.use(this.middlewareAuth.checkAcl);
  }

  private initRoutes(): void {
    this.router.get("/", this.usuarioController.getAll);
    this.router.get("/:_id", this.usuarioController.getOne);
    this.router.get("/existe/:_usuario", this.usuarioController.getUsuario);
    this.router.get("/buscar/:_nome", this.usuarioController.searchWithNameUsuario);
    this.router.post("/", this.usuarioController.create);
    this.router.put("/:_id", this.usuarioController.update);
    this.router.delete("/:_id", this.usuarioController.delete);
  }
}

export default new UsuarioRotas().router;
