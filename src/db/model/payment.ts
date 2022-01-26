import { Model } from 'sequelize';

export class Payment extends Model {
  public key!: string | null;
  public label!: string | null;
  public price!: number | null;
  public group!: string | null;
  public createdAt!: string | null;
  public updatedAt!: string | null;
  public id!: number | null
}

export class PaymentDetail extends Model {
  public pay!: number | null;
  public description!: string | null;
  public studentId!: number | null;
  public paymentId!: number | null;
  public createdAt!: string | null;
  public referId!: number | null;
  public isInstalment!: boolean | null;
  public id!: number | null
}
