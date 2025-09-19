import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'elearning_english',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: isDev ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  age?: number;
  level?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: 'student' | 'teacher' | 'admin';
  public age?: number;
  public level?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const Usuario = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    allowNull: false,
    defaultValue: 'student',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate: async (user: any) => {
      if (user.password) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        user.password = await bcrypt.hash(user.password, rounds);
      }
    },
    beforeUpdate: async (user: any) => {
      if (user.changed('password')) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        user.password = await bcrypt.hash(user.password, rounds);
      }
    },
  },
});

export const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  freezeTableName: true,
});

export const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Lesson',
      key: 'id',
    },
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  freezeTableName: true,
});

export const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  lessonId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Lesson',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

// Relationships
Usuario.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(Usuario, { foreignKey: 'userId' });

Lesson.hasMany(Progress, { foreignKey: 'lessonId' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId' });

Lesson.hasMany(Quiz, { foreignKey: 'lessonId' });
Quiz.belongsTo(Lesson, { foreignKey: 'lessonId' });