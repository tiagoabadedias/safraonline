import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Especificacao } from "../../models/Especificacao";
import { sequelize } from "../../sequelize";

export class EspecificacaoController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const especificacoes: any[] = await Especificacao.findAll({
    });
    response.json(especificacoes);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Especificacao.findOne<Especificacao>({
      where: {id: _id},
    })
    .then((especificacao) => {
      response.json(especificacao);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const especificacao = Especificacao.build<Especificacao>({
        id: Uuid(),
        nome: request.body.nome,
      });

      especificacao.save()
        .then((especificacao: any) => {
          response.json(especificacao);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const especificacaoParaAtualizar = await Especificacao.findOne<Especificacao>({
        where: { id: _id },
      }) as Especificacao;

      if (request.body.nome) { especificacaoParaAtualizar.nome = request.body.nome; }

      try {
        const especificacaoAtualizado = await especificacaoParaAtualizar.save({ transaction: t });

        response.json(especificacaoAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Especificacao.destroy({
      where: { id: request.params._id },
    })
    .then((especificacaoDeletado) => {
      response.json(especificacaoDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }

  public searchWithNameEspecificacao(request: Request, response: Response, next: NextFunction): void {
    const _nome = request.params._nome;
    if (_nome.length > 1) {
      Especificacao.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `%${_nome}%`,
          },
        },
      })
      .then((especificacoes) => {
        response.json(especificacoes);
      })
      .catch((err) => {
        next(err);
      });
    } else {
      Especificacao.findAll({
        limit: 20,
        where: {
          nome: {
            $like: `${_nome}%`,
          },
        },
      })
      .then((especificacoes) => {
        response.json(especificacoes);
      })
      .catch((err) => {
        next(err);
      });
    }
  }
}
