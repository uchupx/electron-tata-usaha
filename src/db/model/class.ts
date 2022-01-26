import { Model } from 'sequelize';
// declare const __static: string;

export class Class extends Model {
    public name!: string | null;
    public id!: number | null
}