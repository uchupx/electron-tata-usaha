import { Model } from 'sequelize';
// declare const __static: string;

export const entityUpdate = 'update'
export const entityCreate = 'create'
export class Activity extends Model {
    public createdAt!: string | null;
    public payload!: string | null;
    public entityId!: number | null;
    public entity!: string | null;
    public type!: string | null;
    public id!: number | null

    public toJson() {
        this.get
    }
}

//  { User };