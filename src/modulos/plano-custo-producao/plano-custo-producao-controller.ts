import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { PlanoCustoProducao } from "../../models/PlanoCustoProducao";
import { sequelize } from "../../sequelize";

export class PlanoCustoProducaoController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const planoCustoProducao: any[] = await PlanoCustoProducao.findAll({
    });
    response.json(planoCustoProducao);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    PlanoCustoProducao.findOne<PlanoCustoProducao>({
      where: {id: _id},
    })
    .then((planoCustoProducao) => {
      response.json(planoCustoProducao);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const planoCustoProducao = PlanoCustoProducao.build<PlanoCustoProducao>({
        CulturaId: request.body.CulturaId,
        ProdutorId: request.body.ProdutorId,
        SistemaCultivoId: request.body.SistemaCultivoId,
        id: Uuid(),
        modelo: request.body.modelo,
      });

      planoCustoProducao.save()
        .then((planoCustoProducao: any) => {
          response.json(planoCustoProducao);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const planoCustoProducaoParaAtualizar = await PlanoCustoProducao.findOne<PlanoCustoProducao>({
        where: { id: _id },
      }) as PlanoCustoProducao;

      if (request.body.CulturaId) { planoCustoProducaoParaAtualizar.CulturaId = request.body.CulturaId; }
      if (request.body.ProdutorId) { planoCustoProducaoParaAtualizar.ProdutorId = request.body.ProdutorId; }
      if (request.body.SistemaCultivoId) { planoCustoProducaoParaAtualizar.SistemaCultivoId = request.body.SistemaCultivoId; }
      if (request.body.modelo) { planoCustoProducaoParaAtualizar.modelo = request.body.modelo; }

      try {
        const planoCustoProducaoAtualizado = await planoCustoProducaoParaAtualizar.save({ transaction: t });

        response.json(planoCustoProducaoParaAtualizar);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    PlanoCustoProducao.destroy({
      where: { id: request.params._id },
    })
    .then((planoCustoProducaoDeletado) => {
      response.json(planoCustoProducaoDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }
}
