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

@Table({
  timestamps: true,
})
export class Pessoa extends Model<Pessoa> {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @AllowNull(false)
  @Column(DataType.STRING) public nome: string;

  @Column(DataType.STRING) public email: string;

  @Column(DataType.STRING) public telefone: string;

  @Column(DataType.STRING) public dataNascimento: string;

  @HasOne(() => Usuario)
  public usuario: Usuario;

}
