import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Cultura } from "../../models/Cultura";
import { SistemaCultivo } from "../../models/SistemaCultivo";
import { sequelize } from "../../sequelize";

export class SistemaCultivoController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const sistemasCultivo: any[] = await SistemaCultivo.findAll({
    });
    response.json(sistemasCultivo);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    SistemaCultivo.findOne<SistemaCultivo>({
      where: {id: _id},
    })
    .then((sistemaCultivo) => {
      response.json(sistemaCultivo);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const sistemaCultivo = SistemaCultivo.build<SistemaCultivo>({
        id: Uuid(),
        nome: request.body.nome,
      });

      sistemaCultivo.save()
        .then((sistemaCultivo: any) => {
          response.json(sistemaCultivo);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const sistemaCultivoParaAtualizar = await SistemaCultivo.findOne<SistemaCultivo>({
        where: { id: _id },
      }) as SistemaCultivo;

      if (request.body.nome) { sistemaCultivoParaAtualizar.nome = request.body.nome; }

      try {
        const sistemaCultivoAtualizado = await sistemaCultivoParaAtualizar.save({ transaction: t });

        response.json(sistemaCultivoAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    SistemaCultivo.destroy({
      where: { id: request.params._id },
    })
    .then((sistemaCultivoDeletado) => {
      response.json(sistemaCultivoDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }

  public searchWithNameSistemaCultivo(request: Request, response: Response, next: NextFunction): void {
    const _nome = request.params._nome;
    if (_nome.length > 1) {
      SistemaCultivo.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `%${_nome}%`,
          },
        },
      })
      .then((sistemasCultivo) => {
        response.json(sistemasCultivo);
      })
      .catch((err) => {
        next(err);
      });
    } else {
      SistemaCultivo.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `${_nome}%`,
          },
        },
      })
      .then((sistemasCultivo) => {
        response.json(sistemasCultivo);
      })
      .catch((err) => {
        next(err);
      });
    }
  }
}
