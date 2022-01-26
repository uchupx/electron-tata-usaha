import { Model } from 'sequelize';
// declare const __static: string;

export class Student extends Model {
    public id!: number | null;
    public name!: string | null;
    public classId!: number | null;
    public address!: string | null;
    public semester!: number | null;
    public gender!: string | null;
    public createdAt!: string | null;
    public updatedAt!: string | null;
    public academicYear!: string | null;
    public isOrphan!: boolean | null;
}

//  { User };