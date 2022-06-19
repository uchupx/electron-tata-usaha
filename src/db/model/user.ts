import { Model } from 'sequelize'

export class User extends Model {
  public id!: number | null
  public nama!: string | null;
  public username!: string | null;
  public password!: string | null;
}