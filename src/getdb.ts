import { remote } from "electron";
import path from 'path';
import { Student } from '@/db/model/student'
import { Payment, PaymentDetail } from '@/db/model/payment'
import { Activity } from '@/db/model/activity'
import { Class } from '@/db/model/class'
import { DataTypes, Sequelize } from 'sequelize';
declare const __static: string;

// todo try loading db from userData

const univDb = path.join(remote.app.getPath("userData"), "data.db")

// todo the below is the path to local db under src/data.db
/* const isBuild = process.env.NODE_ENV === 'production';
const locDb = path.join(
    // eslint-disable-next-line
    isBuild ? __dirname : __static,
    '../src/data.db',
);
 */
// setup the connection to make sure it works
const sequelize = new Sequelize({
    dialect: 'sqlite',
    // todo change this to locDb for using db inside src/data.db
    storage: univDb,
    // ** db event logging true in dev and false in production
    logging: (process.env.NODE_ENV !== 'production') ? true : false,
    define: {
        timestamps: false,
        underscored: true,
    },
});

Student.init({
    name: {
        type: DataTypes.STRING, allowNull: true
    },
    classId: {
        type: DataTypes.NUMBER, allowNull: true
    },
    address: {
        type: DataTypes.STRING, allowNull: true
    },
    semester: {
        type: DataTypes.NUMBER, allowNull: true
    },
    gender: {
        type: DataTypes.STRING, allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE, allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE, allowNull: true
    },
    academicYear: {
        type: DataTypes.STRING, allowNull: true
    },
    isOrphan: {
        type: DataTypes.BOOLEAN, allowNull: true
    },
}, {
    tableName: 'students',
    sequelize
})
Student.sync()

Payment.init({
    key: {
        type: DataTypes.STRING, allowNull: true
    },
    label: {
        type: DataTypes.STRING, allowNull: true
    },
    price: {
        type: DataTypes.NUMBER, allowNull: true
    },
    group: {
        type: DataTypes.STRING, allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE, allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE, allowNull: true
    },

}, { tableName: 'payments', sequelize })
Payment.sync()

PaymentDetail.init({
    pay: {
        type: DataTypes.NUMBER, allowNull: true
    },
    description: {
        type: DataTypes.STRING, allowNull: true
    },
    studentId: {
        type: DataTypes.NUMBER, allowNull: true
    },
    paymentId: {
        type: DataTypes.NUMBER, allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE, allowNull: true
    },
    referId: {
        type: DataTypes.NUMBER, allowNull: true
    },
    isInstalment: {
        type: DataTypes.BOOLEAN, allowNull: true
    },

}, { tableName: 'payment_details', sequelize })
PaymentDetail.sync()

Activity.init({
    createdAt: {
        type: DataTypes.DATE, allowNull: true
    },
    payload: {
        type: DataTypes.STRING, allowNull: true
    },
    entityId: {
        type: DataTypes.NUMBER, allowNull: true
    },
    entity: {
        type: DataTypes.STRING, allowNull: true
    },
}, { tableName: 'activities', sequelize })
Activity.sync()

Class.init({
    name: {
        type: DataTypes.STRING, allowNull: true
    }
}, { tableName: 'classes', sequelize })
Class.sync()


export { sequelize, Student, Payment, PaymentDetail, Activity, Class };
