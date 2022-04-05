
export class StudentPaginatedPayload
{
    public name!: string;
    public classId!: string | null;
    public limit!: number;
    public offset!: number;
}

export class DetailsPaginatedPayload
{
    public createdStart?: string | null;
    public createdEnd?: string | null;
    public studentId?: number;
    public limit!: number;
    public offset!: number;
}

export class ActivityPaginatedPayload
{
    public entity!: string;
    public limit!: number;
    public offset!: number;
}