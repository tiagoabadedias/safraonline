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
import { UnidadeMedida } from "./UnidadeMedida";
import { Especificacao } from "./Especificacao";


@Table({
  timestamps: true,
})
export class Cultura extends Model<Cultura> {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @AllowNull(false)
  @Column(DataType.STRING) public nome: string;

  @Column(DataType.STRING) public descricao: string;

}
