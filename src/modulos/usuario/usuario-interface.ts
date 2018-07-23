import { IPerfil } from "../perfil/perfil-interface";
import { IPessoa } from "../pessoa/pessoa-interface";

export interface IUsuario {
  id?: string;
  pessoa?: IPessoa;
  senha?: string;
  usuario?: string;
  perfil?: IPerfil;
  ativo?: boolean;
}
