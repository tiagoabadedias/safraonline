import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { sequelize } from "../../sequelize";
import { Produtor } from "../../models/Produtor";
import { Pessoa } from "../../models/Pessoa";

export class ProdutorController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const produtor: any[] = await Produtor.findAll({
      include:[Pessoa]
    });
    response.json(produtor);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Produtor.findOne<Produtor>({
      include:[Pessoa],
      where: {id: _id},
    })
    .then((produtor) => {
      response.json(produtor);
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
      
      const produtor = Produtor.build<Produtor>({
        PessoaId: pessoa.id,
        id: Uuid(),
        pessoa
      }, {
        include:[Pessoa]
      });

      produtor.save()
        .then((novoProdutor: any) => {
          response.json(novoProdutor);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;


      const produtorParaAtualizar = await Produtor.findOne<Produtor>({
        include:[Pessoa],
        where: { id: _id },
      }) as Produtor;

      const pessoaParaAtualizar: Pessoa = produtorParaAtualizar.pessoa;

      if (request.body.pessoa.nome) { pessoaParaAtualizar.nome = request.body.pessoa.nome; }
      if (request.body.pessoa.telefone) { pessoaParaAtualizar.telefone = request.body.pessoa.telefone; }
      if (request.body.pessoa.email) { pessoaParaAtualizar.email = request.body.pessoa.email; }
      if (request.body.pessoa.dataNascimento) { pessoaParaAtualizar.dataNascimento = request.body.pessoa.dataNascimento; }

      try {
        const pessoaAtualizada = await pessoaParaAtualizar.save({ transaction: t });
        const produtorAtualizado = await produtorParaAtualizar.save({ transaction: t });

        response.json(produtorAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Produtor.destroy({
      where: { id: request.params._id },
    })
    .then((produtor) => {
      response.json(produtor);
    })
    .catch((err) => {
      next(err);
    });
  }
}