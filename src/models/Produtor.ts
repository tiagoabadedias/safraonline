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

import { Usuario } from "./Usuario";
import { Pessoa } from "./Pessoa";

@Table({
  timestamps: true,
})
export class Produtor extends Model<Produtor> {
  
  @PrimaryKey
  @Column
  public id: string;

  @ForeignKey(() => Pessoa)
  @Column
  public PessoaId: string;

  @BelongsTo(() => Pessoa)
  public pessoa: Pessoa;

}
