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

import { SistemaCultivo } from "./SistemaCultivo";
import { UnidadeMedida } from "./UnidadeMedida";
import { Cultura } from "./Cultura";
import { Especificacao } from "./Especificacao";
import { Produtor } from "./Produtor";

@Table({
  timestamps: true,
})
export class PlanoCustoProducao extends Model<PlanoCustoProducao> {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @ForeignKey(() => SistemaCultivo)
  @Column(DataType.STRING)
  public SistemaCultivoId: string;

  @ForeignKey(() => Produtor)
  @Column(DataType.STRING)
  public ProdutorId: string;

  @ForeignKey(() => Cultura)
  @Column(DataType.STRING)
  public CulturaId: string;

  @Column(DataType.STRING) public modelo: string;

  @BelongsTo(() => SistemaCultivo)
  public sistemaCultivo: SistemaCultivo;

  @BelongsTo(() => Produtor)
  public produtor: Produtor;

  @BelongsTo(() => Cultura)
  public cultura: Cultura;

}
