import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { ComponenteCusto } from "../../models/ComponenteCusto";
import { ComponenteCustoProducao } from "../../models/ComponenteCustoProducao";
import { Especificacao } from "../../models/Especificacao";
import { UnidadeMedida } from "../../models/UnidadeMedida";
import { sequelize } from "../../sequelize";

export class ComponenteCustoProducaoController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const componenteCustoProducao: any[] = await ComponenteCustoProducao.findAll({
      include: [{
        include: [{
          model: UnidadeMedida,
        },
        {
          model: Especificacao,
        }],
        model: ComponenteCusto,
      },
      {
        model: Especificacao,
      },
      {
        model: UnidadeMedida,
      },
      {
        model: ComponenteCustoProducao,
      }],
    });
    response.json(componenteCustoProducao);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    ComponenteCustoProducao.findOne<ComponenteCustoProducao>({
      include: [{
        model: ComponenteCusto,
      },
      {
        model: Especificacao,
      },
      {
        model: UnidadeMedida,
      },
      {
        include: [{
          model: ComponenteCusto,
        },
        {
          model: Especificacao,
        },
        {
          model: UnidadeMedida,
        }],
        model: ComponenteCustoProducao,
      }],
      where: {id: _id},
    })
    .then((componenteCustoProducao) => {
      response.json(componenteCustoProducao);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const componenteCustoProducao = ComponenteCustoProducao.build<ComponenteCustoProducao>({
        ComponenteCustoId: request.body.ComponenteCustoId,
        ComponenteCustoProducaoPaiId: request.body.ComponenteCustoProducaoPaiId,
        EspecificacaoId: request.body.EspecificacaoId,
        PlanoCustoProducaoId: request.body.PlanoCustoProducaoId,
        UnidadeMedidaId: request.body.UnidadeMedidaId,
        formulaCalculo: request.body.formulaCalculo,
        id: Uuid(),
        indice: request.body.indice,
        nivel: request.body.nivel,
        quantidade: request.body.quantidade,
        valorTotal: request.body.valorTotal,
        valorUnitario: request.body.valorUnitario,
      });

      componenteCustoProducao.save()
        .then((componenteCustoProducao: any) => {
          response.json(componenteCustoProducao);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const componenteCustoProducaoParaAtualizar = await ComponenteCustoProducao.findOne<ComponenteCustoProducao>({
        where: { id: _id },
      }) as ComponenteCustoProducao;

      // tslint:disable-next-line:max-line-length
      if (request.body.ComponenteCustoId) { componenteCustoProducaoParaAtualizar.ComponenteCustoId = request.body.ComponenteCustoId; }
      // tslint:disable-next-line:max-line-length
      if (request.body.ComponenteCustoProducaoPaiId) { componenteCustoProducaoParaAtualizar.ComponenteCustoProducaoPaiId = request.body.ComponenteCustoProducaoPaiId; }
      // tslint:disable-next-line:max-line-length
      if (request.body.EspecificacaoId) { componenteCustoProducaoParaAtualizar.EspecificacaoId = request.body.EspecificacaoId; }
      // tslint:disable-next-line:max-line-length
      if (request.body.PlanoCustoProducaoId) { componenteCustoProducaoParaAtualizar.PlanoCustoProducaoId = request.body.PlanoCustoProducaoId; }
      // tslint:disable-next-line:max-line-length
      if (request.body.UnidadeMedidaId) { componenteCustoProducaoParaAtualizar.UnidadeMedidaId = request.body.UnidadeMedidaId; }
      // tslint:disable-next-line:max-line-length
      if (request.body.indice) { componenteCustoProducaoParaAtualizar.indice = request.body.indice; }
      // tslint:disable-next-line:max-line-length
      if (request.body.nivel) { componenteCustoProducaoParaAtualizar.nivel = request.body.nivel; }
      // tslint:disable-next-line:max-line-length
      if (request.body.quantidade) { componenteCustoProducaoParaAtualizar.quantidade = request.body.quantidade; }
      // tslint:disable-next-line:max-line-length
      if (request.body.valorTotal) { componenteCustoProducaoParaAtualizar.valorTotal = request.body.valorTotal; }
      // tslint:disable-next-line:max-line-length
      if (request.body.valorUnitario) { componenteCustoProducaoParaAtualizar.valorUnitario = request.body.valorUnitario; }

      try {
        const componenteCustoProducaoAtualizado = await componenteCustoProducaoParaAtualizar.save({ transaction: t });

        response.json(componenteCustoProducaoAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    ComponenteCustoProducao.destroy({
      where: { id: request.params._id },
    })
    .then((componenteCustoProducaoDeletado) => {
      response.json(componenteCustoProducaoDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }
}
