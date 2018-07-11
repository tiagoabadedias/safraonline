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


@Table({
  timestamps: true,
})
export class Especificacao extends Model<Especificacao> {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @AllowNull(false)
  @Column(DataType.STRING) public nome: string;

  @Column(DataType.STRING) public quantidade: string;

  @Column(DataType.STRING) public valorUnitario: string;

}
