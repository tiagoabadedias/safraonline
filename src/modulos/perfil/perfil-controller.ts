import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Perfil } from "../../models/Perfil";
import { Pessoa } from "../../models/Pessoa";
import { sequelize } from "../../sequelize";

export class PerfilController {
  // tslint:disable-next-line:no-empty
  constructor() {}

  public getAll(request: Request, response: Response, next: NextFunction): void {
    Perfil.findAll().then((perfis) => {
      response.json(perfis);
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
      sequelize.transaction (async (t: Transaction) => {
      const _id = request.params._id;

      const perfilOne = await Perfil.findOne<Perfil>({
        where: { id: _id },
      }) as Perfil;


      const perfilParaAtualizar = await Perfil.findOne<Perfil>({
        where: { id: _id },
      }) as Perfil;

      if (request.body.nome) { perfilParaAtualizar.nome = request.body.nome; }

      try {

        // tslint:disable-next-line:max-line-length
        const perfilAtualizado = await Perfil.update({ nome: perfilParaAtualizar.nome }, { where: { id: perfilParaAtualizar.id}, transaction: t });


        response.json(perfilParaAtualizar);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public delete(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;

    Perfil.destroy({
      where: { id: _id },
    })
    .then((perfilDeletado) => {
      response.json(perfilDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }
}
