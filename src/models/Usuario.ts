import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Length,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

import { Perfil } from "./Perfil";
import { Pessoa } from "./Pessoa";

@Table({
  timestamps: true,
})

export class Usuario extends Model<Usuario> {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  // @ForeignKey(() => Perfil)
  // @Column(DataType.STRING)
  // public PerfilId: string;

  @ForeignKey(() => Pessoa)
  @Column(DataType.STRING)
  public PessoaId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING) public usuario: string;

  @AllowNull(false)
  @Column(DataType.STRING) public senha: string;

  @Column(DataType.BOOLEAN) public ativo: boolean;

  @Column(DataType.BLOB("long"))
  get imagem(): string {
    return this.getDataValue("imagem") ? this.getDataValue("imagem").toString("utf-8") : null;
  }
  set imagem(item) {
    this.setDataValue("imagem", item);
  }

  @BelongsTo(() => Pessoa)
  public pessoa: Pessoa;

  // @BelongsTo(() => Perfil)
  // public perfil: Perfil;

}
