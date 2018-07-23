import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { sequelize } from "../../sequelize";
import { Pessoa } from "../../models/Pessoa";
import { Consultor } from "../../models/Consultor";

export class ConsultorController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const consultor: any[] = await Consultor.findAll({
      include:[Pessoa]
    });
    response.json(consultor);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Consultor.findOne<Consultor>({
      include:[Pessoa],
      where: {id: _id},
    })
    .then((consultor) => {
      response.json(consultor);
    })
    .catch((err) => {
      next(err);
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const pessoa = Pessoa.build<Pessoa>({
        dataNascimento: request.body.pessoa.dataNascimento,
        email: request.body.pessoa.email,
        id: Uuid(),
        nome: request.body.pessoa.nome,   
        telefone: request.body.pessoa.telefone,
      })
      
      const consultor = Consultor.build<Consultor>({
        PessoaId: pessoa.id,
        id: Uuid(),
        pessoa
      }, {
        include:[Pessoa]
      });

      consultor.save()
        .then((novoConsultor: any) => {
          response.json(novoConsultor);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;


      const consultorParaAtualizar = await Consultor.findOne<Consultor>({
        include:[Pessoa],
        where: { id: _id },
      }) as Consultor;

      const pessoaParaAtualizar: Pessoa = consultorParaAtualizar.pessoa;

      if (request.body.pessoa.nome) { pessoaParaAtualizar.nome = request.body.pessoa.nome; }
      if (request.body.pessoa.telefone) { pessoaParaAtualizar.telefone = request.body.pessoa.telefone; }
      if (request.body.pessoa.email) { pessoaParaAtualizar.email = request.body.pessoa.email; }
      if (request.body.pessoa.dataNascimento) { pessoaParaAtualizar.dataNascimento = request.body.pessoa.dataNascimento; }

      try {
        const pessoaAtualizada = await pessoaParaAtualizar.save({ transaction: t });
        const consultorAtualizado = await consultorParaAtualizar.save({ transaction: t });

        response.json(consultorAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Consultor.destroy({
      where: { id: request.params._id },
    })
    .then((consultor) => {
      response.json(consultor);
    })
    .catch((err) => {
      next(err);
    });
  }
}