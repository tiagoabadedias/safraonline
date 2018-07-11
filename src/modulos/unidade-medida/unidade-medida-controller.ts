import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { UnidadeMedida } from "../../models/UnidadeMedida";
import { sequelize } from "../../sequelize";

export class UnidadeMedidaController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const unidadesMedida: any[] = await UnidadeMedida.findAll({
    });
    response.json(unidadesMedida);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    UnidadeMedida.findOne<UnidadeMedida>({
      where: {id: _id},
    })
    .then((unidadeMedida) => {
      response.json(unidadeMedida);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const unidadeMedida = UnidadeMedida.build<UnidadeMedida>({
        sigla: request.body.sigla,
        id: Uuid(),
        nome: request.body.nome,
      });

      unidadeMedida.save()
        .then((unidadeMedida: any) => {
          response.json(unidadeMedida);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const unidadeMedidaParaAtualizar = await UnidadeMedida.findOne<UnidadeMedida>({
        where: { id: _id },
      }) as UnidadeMedida;

      if (request.body.nome) { unidadeMedidaParaAtualizar.nome = request.body.nome; }
      if (request.body.sigla) { unidadeMedidaParaAtualizar.sigla = request.body.sigla; }

      try {
        const unidadeMedidaAtualizado = await unidadeMedidaParaAtualizar.save({ transaction: t });

        response.json(unidadeMedidaAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    UnidadeMedida.destroy({
      where: { id: request.params._id },
    })
    .then((unidadeMedidaDeletado) => {
      response.json(unidadeMedidaDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }

  public searchWithNameUnidadeMedida(request: Request, response: Response, next: NextFunction): void {
    const _nome = request.params._nome;
    if (_nome.length > 1) {
      UnidadeMedida.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `%${_nome}%`,
          },
        },
      })
      .then((unidadesMedida) => {
        response.json(unidadesMedida);
      })
      .catch((err) => {
        next(err);
      });
    } else {
      UnidadeMedida.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `${_nome}%`,
          },
        },
      })
      .then((unidadesMedida) => {
        response.json(unidadesMedida);
      })
      .catch((err) => {
        next(err);
      });
    }
  }
}
