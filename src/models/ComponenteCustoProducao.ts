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
import { PlanoCustoProducao } from "./PlanoCustoProducao";
import { ComponenteCusto } from "./ComponenteCusto";

@Table({
  timestamps: true,
})
export class ComponenteCustoProducao extends Model<ComponenteCustoProducao> {
  
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @ForeignKey(() => ComponenteCustoProducao)
  @Column(DataType.STRING)
  public ComponenteCustoProducaoPaiId: string;

  @ForeignKey(() => PlanoCustoProducao)
  @Column(DataType.STRING)
  public PlanoCustoProducaoId: string;

  @ForeignKey(() => ComponenteCusto)
  @Column(DataType.STRING)
  public ComponenteCustoId: string;

  @ForeignKey(() => Especificacao)
  @Column(DataType.STRING)
  public EspecificacaoId: string;

  @ForeignKey(() => UnidadeMedida)
  @Column(DataType.STRING)
  public UnidadeMedidaId: string;

  @Column(DataType.STRING) public nivel: string;

  @Column(DataType.STRING) public indice: string;

  @Column(DataType.STRING) public quantidade: string;

  @Column(DataType.STRING) public valorUnitario: string;

  @Column(DataType.STRING) public valorTotal: string;

  @Column(DataType.STRING) public formulaCalculo: string;

  @HasMany(() => ComponenteCustoProducao)
  public componenteCustoProducaoFilhos: ComponenteCustoProducao;

  // @BelongsTo(() => ComponenteCustoProducao)
  // public componenteCustoProducaoPai: ComponenteCustoProducao;

  @BelongsTo(() => PlanoCustoProducao)
  public planoCustoProducao: PlanoCustoProducao;

  @BelongsTo(() => ComponenteCusto)
  public componenteCusto: ComponenteCusto;

  @BelongsTo(() => Especificacao)
  public especificacao: Especificacao;

  @BelongsTo(() => UnidadeMedida)
  public unidadeMedida: UnidadeMedida;

}
