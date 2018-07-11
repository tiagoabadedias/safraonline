import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { ComponenteCusto } from "../../models/ComponenteCusto";
import { sequelize } from "../../sequelize";

export class ComponenteCustoController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const componentesCusto: any[] = await ComponenteCusto.findAll({
    });
    response.json(componentesCusto);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    ComponenteCusto.findOne<ComponenteCusto>({
      include:[{
        model: 
      }],
      where: {id: _id},
    })
    .then((componenteCusto) => {
      response.json(componenteCusto);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const componenteCusto = ComponenteCusto.build<ComponenteCusto>({
        EspecificacaoId: request.body.EspecificacaoId,
        UnidadeMedidaId: request.body.UnidadeMedidaId,
        descricao: request.body.descricao,
        formulaCalculo: request.body.formulaCalculo,
        id: Uuid(),
        nivel: request.body.nivel,
        nome: request.body.nome,
      });

      componenteCusto.save()
        .then((componenteCusto: any) => {
          response.json(componenteCusto);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const componenteCustoParaAtualizar = await ComponenteCusto.findOne<ComponenteCusto>({
        where: { id: _id },
      }) as ComponenteCusto;

      if (request.body.EspecificacaoId) { componenteCustoParaAtualizar.EspecificacaoId = request.body.EspecificacaoId; }
      if (request.body.UnidadeMedidaId) { componenteCustoParaAtualizar.UnidadeMedidaId = request.body.UnidadeMedidaId; }
      if (request.body.descricao) { componenteCustoParaAtualizar.descricao = request.body.descricao; }
      if (request.body.formulaCalculo) { componenteCustoParaAtualizar.formulaCalculo = request.body.formulaCalculo; }
      if (request.body.nivel) { componenteCustoParaAtualizar.nivel = request.body.nivel; }
      if (request.body.nome) { componenteCustoParaAtualizar.nome = request.body.nome; }

      try {
        const componenteCustoAtualizado = await componenteCustoParaAtualizar.save({ transaction: t });

        response.json(componenteCustoAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    ComponenteCusto.destroy({
      where: { id: request.params._id },
    })
    .then((componenteCustoDeletado) => {
      response.json(componenteCustoDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }

  public searchWithNameComponenteCusto(request: Request, response: Response, next: NextFunction): void {
    const _nome = request.params._nome;
    if (_nome.length > 1) {
      ComponenteCusto.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `%${_nome}%`,
          },
        },
      })
      .then((componentesCusto) => {
        response.json(componentesCusto);
      })
      .catch((err) => {
        next(err);
      });
    } else {
      ComponenteCusto.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `${_nome}%`,
          },
        },
      })
      .then((componentesCusto) => {
        response.json(componentesCusto);
      })
      .catch((err) => {
        next(err);
      });
    }
  }
}
