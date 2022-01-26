import { Model } from 'sequelize';
// declare const __static: string;

export class Activity extends Model {
    public createdAt!: string | null;
    public payload!: string | null;
    public entityId!: number | null;
    public entity!: string | null;
    public id!: number | null
}

//  { User };