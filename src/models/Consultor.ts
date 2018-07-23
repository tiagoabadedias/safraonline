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
} from "sequelize-typescript";

import { Pessoa } from "./Pessoa";
import { Usuario } from "./Usuario";

@Table({
  timestamps: true,
})
export class Consultor extends Model<Consultor> {

  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @ForeignKey(() => Pessoa)
  @Column(DataType.STRING)
  public PessoaId: string;

  @BelongsTo(() => Pessoa)
  public pessoa: Pessoa;

}
