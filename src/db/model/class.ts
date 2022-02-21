import { Model } from 'sequelize';
// declare const __static: string;

export class Class extends Model {
    public name!: string | null;
    public id!: number | null
}

export class StudentClass extends Model {
    public id!: number | null;
    public studentId!: number | null;
    public classId!: number | null;
    public academicYearId!: number | null;
    public isActive!: boolean | null;
    public createdAt!: string | null;
}

export class AcademicYear extends Model {
    public id!: number | null;
    public label!: string | null;
}