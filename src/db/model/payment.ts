import { Model } from 'sequelize';

export class Payment extends Model {
  public key!: string | null;
  public label!: string | null;
  public price!: number | null;
  public group!: string | null;
  public createdAt!: string | null;
  public updatedAt!: string | null;
  public list!: [] | null;
  public isActive !: boolean | null;
  public id!: number | null
}

export class PaymentDetail extends Model {
  public pay!: number;
  public description!: string | null;
  public studentId!: number | null;
  public paymentId!: number | null;
  public createdAt!: string | null;
  public referId!: number | null;
  public academicYearId!: number | null;
  public isInstalment!: boolean | null;
  public id!: number | null

  public rawTupleToModel(tuple: any) {
    this.pay = tuple.pay
    this.description = tuple.description
    this.studentId = tuple.student_id
    this.paymentId = tuple.payment_id
    this.createdAt = tuple.created_at
    this.referId = tuple.refer_id
    this.academicYearId = tuple.academic_year_id
    this.isInstalment = tuple.is_instalment
    this.id = tuple.id
  }
  
}

