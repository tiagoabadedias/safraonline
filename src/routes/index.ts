import * as express from "express";
import { MiddlewareAuth } from "../middlewares/middleware-auth";
import { AutenticarController } from "../modulos/auth/auth-controller";
import componenteCustoProducaoRotas from "./../modulos/componente-custo-producao/componente-custo-producao-rotas";
import perfilRotas from "./../modulos/perfil/perfil-rotas";
import usuarioRotas from "./../modulos/usuario/usuario-rotas";

class Routes {
  public express: express.Application;
  public router: express.Router;
  public autenticarController: AutenticarController;
  public middlewareAuth: MiddlewareAuth;

  constructor() {
    this.express = express();
    this.router = express.Router();
    this.autenticarController = new AutenticarController();
    this.middlewareAuth = new MiddlewareAuth();
    this.routes();
  }

  private routes(): void {
    // Rotas de autenticação
    this.router.post("/token", this.autenticarController.token);
    this.router.post("/refresh-token", this.middlewareAuth.checkAuth, this.autenticarController.refreshToken);
    // Rotas dos módulos
    this.router.use("/usuario", usuarioRotas);
    this.router.use("/perfil", perfilRotas);
    this.router.use("/componente-custo-producao", componenteCustoProducaoRotas);
  }
}

export default new Routes().router;
