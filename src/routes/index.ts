import * as express from "express";
import { MiddlewareAuth } from "../middlewares/middleware-auth";
import { AutenticarController } from "../modulos/auth/auth-controller";
import componenteCustoProducaoRotas from "./../modulos/componente-custo-producao/componente-custo-producao-rotas";
import perfilRotas from "./../modulos/perfil/perfil-rotas";
import usuarioRotas from "./../modulos/usuario/usuario-rotas";
import uniadeMedidaRotas from "./../modulos/unidade-medida/unidade-medida-rotas";
import produtorRotas from "./../modulos/produtor/produtor-rotas"
import consultorRotas from "./../modulos/consultor/consultor-rotas"
import culturaRotas from "./../modulos/cultura/cultura-rotas"
import sistemaCultivoRotas from "../modulos/sistema-cultivo/sistema-cultivo-rotas";

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
    this.router.use("/unidade-medida", uniadeMedidaRotas)
    this.router.use("/produtor", produtorRotas)
    this.router.use("/consultor", consultorRotas)
    this.router.use("/sistema-cultivo", sistemaCultivoRotas);
    this.router.use("/cultura", culturaRotas);
  }
}

export default new Routes().router;
