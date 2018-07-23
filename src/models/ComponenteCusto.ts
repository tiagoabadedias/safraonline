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
export class ComponenteCusto extends Model<ComponenteCusto> {
  @PrimaryKey
  @Column(DataType.STRING)
  public id: string;

  @ForeignKey(() => UnidadeMedida)
  @Column(DataType.STRING)
  public UnidadeMedidaId: string;

  @ForeignKey(() => Especificacao)
  @Column(DataType.STRING)
  public EspecificacaoId: string;

  @Column(DataType.STRING) public nivel: string;

  @AllowNull(false)
  @Column(DataType.STRING) public nome: string;

  @Column(DataType.STRING) public descricao: string;

  @Column(DataType.STRING) public formulaCalculo: string;

  @BelongsTo(() => UnidadeMedida)
  public unidadeMedida: UnidadeMedida;

  @BelongsTo(() => Especificacao)
  public especificacao: Especificacao;

}
