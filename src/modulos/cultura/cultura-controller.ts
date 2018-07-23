import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Cultura } from "../../models/Cultura";
import { sequelize } from "../../sequelize";

export class CulturaController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const culturas: any[] = await Cultura.findAll({
    });
    response.json(culturas);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Cultura.findOne<Cultura>({
      where: {id: _id},
    })
    .then((cultura) => {
      response.json(cultura);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const cultura = Cultura.build<Cultura>({
        descricao: request.body.descricao,
        id: Uuid(),
        nome: request.body.nome,
      });

      cultura.save()
        .then((cultura: any) => {
          response.json(cultura);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const culturaParaAtualizar = await Cultura.findOne<Cultura>({
        where: { id: _id },
      }) as Cultura;

      if (request.body.nome) { culturaParaAtualizar.nome = request.body.nome; }
      if (request.body.descricao) { culturaParaAtualizar.descricao = request.body.descricao; }

      try {
        const culturaAtualizado = await culturaParaAtualizar.save({ transaction: t });

        response.json(culturaAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Cultura.destroy({
      where: { id: request.params._id },
    })
    .then((culturaDeletado) => {
      response.json(culturaDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }

  public searchWithNameCultura(request: Request, response: Response, next: NextFunction): void {
    const _nome = request.params._nome;
    if (_nome.length > 1) {
      Cultura.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `%${_nome}%`,
          },
        },
      })
      .then((culturas) => {
        response.json(culturas);
      })
      .catch((err) => {
        next(err);
      });
    } else {
      Cultura.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `${_nome}%`,
          },
        },
      })
      .then((culturas) => {
        response.json(culturas);
      })
      .catch((err) => {
        next(err);
      });
    }
  }
}
