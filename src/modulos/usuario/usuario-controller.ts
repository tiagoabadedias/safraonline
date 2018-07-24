import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";
import * as Uuid from "uuid";
import { ICustomRequest } from "../../interfaces/custom-request";
import { Perfil } from "../../models/Perfil";
import { Pessoa } from "../../models/Pessoa";
import { Usuario } from "../../models/Usuario";
import { sequelize } from "../../sequelize";

export class UsuarioController {
  constructor() {}

  public async getAll(request: Request, response: Response, next: NextFunction) {
    const usuarios: any[] = await Usuario.findAll({
        include: [{
          model: Pessoa,
        }, {
          attributes: ["id", "nome"],
          model: Perfil,
        }],
    });
    response.json(usuarios);
  }

  public getOne(request: Request, response: Response, next: NextFunction): void {
    const _id = request.params._id;
    Usuario.findOne<Usuario>({
      attributes: ["id" , "usuario", "imagem", "PerfilId", "createdAt"],
      include: [{
        model: Pessoa,
      }, {
        attributes: ["id", "nome"],
        model: Perfil,
      }],
      where: {id: _id},
    })
    .then((usuario) => {
      response.json(usuario);
    })
    .catch((err) => {
      next(err);
    });
  }

  public async getUsuario(request: Request, response: Response, next: NextFunction) {
    const _usuario = request.params._usuario;
    const helperUsuario = new HelperUsuario();
    const usuarioExistente = await helperUsuario.exists(_usuario);
    response.json({
      existe: usuarioExistente,
    });
  }

  public create(request: Request, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const pessoa = Pessoa.build<Pessoa>(
        {
          dataNascimento: request.body.pessoa.dataNascimento,
          email: request.body.pessoa.email,
          id: Uuid(),
          nome: request.body.pessoa.nome,   
          telefone: request.body.pessoa.telefone,
        },
      );

      const usuario = Usuario.build<Usuario> ({
        PerfilId: request.body.PerfilId,
        ativo: true,
        id: Uuid(),
        pessoa,
        senha: bcrypt.hashSync("12345", 10),
        usuario: request.body.usuario,
      }, {
        include: [Pessoa],
      },
    );

    usuario.save()
        .then((novoUsuario) => {
          response.json(novoUsuario);
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  public update(request: ICustomRequest, response: Response, next: NextFunction): void {
    sequelize.transaction(async (t: Transaction) => {
      const _id = request.params._id;

      const usuarioParaAtualizar = await Usuario.findOne<Usuario>({
        include: [Pessoa],
        where: { id: _id },
      }) as Usuario;

      const pessoaParaAtualizar: Pessoa = usuarioParaAtualizar.pessoa;

      if (request.body.pessoa.nome) { pessoaParaAtualizar.nome = request.body.pessoa.nome; }
      if (request.body.pessoa.telefone) { pessoaParaAtualizar.telefone = request.body.pessoa.telefone; }
      if (request.body.pessoa.email) { pessoaParaAtualizar.email = request.body.pessoa.email; }
      if (request.body.pessoa.dataNascimento) { pessoaParaAtualizar.dataNascimento = request.body.pessoa.dataNascimento; }

      if (request.body.senha) { usuarioParaAtualizar.senha = bcrypt.hashSync(request.body.senha, 10); }
      if (request.body.usuario) { usuarioParaAtualizar.usuario = request.body.usuario; }
      if (request.body.imagem) { usuarioParaAtualizar.imagem = request.body.imagem; }
      if (request.body.PerfilId) { usuarioParaAtualizar.PerfilId = request.body.PerfilId; }

      try {
        const pessoaAtualizada = await pessoaParaAtualizar.save({ transaction: t });
        const usuarioAtualizado = await usuarioParaAtualizar.save({ transaction: t });

        response.json(usuarioAtualizado);
      } catch (err) {
        t.rollback();
        next(err);
      }
    });
  }

  public async delete(request: ICustomRequest, response: Response, next: NextFunction) {
    Usuario.destroy({
      where: { id: request.params._id },
    })
    .then((usuarioDeletado) => {
      response.json(usuarioDeletado);
    })
    .catch((err) => {
      next(err);
    });
  }

  public searchWithNameUsuario(request: Request, response: Response, next: NextFunction): void {
    const _nome = request.params._nome;
    if (_nome.length > 1) {
      Usuario.findAll({
        attributes: ["id"],
        include: [{
          model: Pessoa,
        }],
        limit: 20,
        where: {
          "$pessoa.nome$": {
            $like: `%${_nome}%`,
          },
        },
      })
      .then((grupos) => {
        response.json(grupos);
      })
      .catch((err) => {
        next(err);
      });
    } else {
      Usuario.findAll({
        attributes: ["id"],
        include: [{
          model: Pessoa,
        }],
        limit: 20,
        where: {
          "$pessoa.nome$": {
            $like: `${_nome}%`,
          },
        },
      })
      .then((grupos) => {
        response.json(grupos);
      })
      .catch((err) => {
        next(err);
      });
    }
    }
}
