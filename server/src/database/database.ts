import { Sequelize, DataTypes } from 'sequelize';
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

export const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'docente', 'estudiante'),
    allowNull: false,
    defaultValue: 'estudiante',
  },
  nombre: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  apellido: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: async (user: any) => {
      if (user.password_hash) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        user.password_hash = await bcrypt.hash(user.password_hash, rounds);
      }
      user.actualizado_en = new Date();
    },
    beforeUpdate: async (user: any) => {
      if (user.changed('password_hash')) {
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        user.password_hash = await bcrypt.hash(user.password_hash, rounds);
      }
      user.actualizado_en = new Date();
    },
  },
});

export const Clase = sequelize.define('clases', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  docente_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  grado: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  seccion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  jornada: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'clases',
  timestamps: false,
  hooks: {
    beforeUpdate: (clase: any) => {
      clase.actualizado_en = new Date();
    },
  },
});

export const ClaseEstudiante = sequelize.define('clases_estudiantes', {
  clase_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'clases',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  estudiante_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  inscrito_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'clases_estudiantes',
  timestamps: false,
});

export const Nivel = sequelize.define('niveles', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'niveles',
  timestamps: false,
  hooks: {
    beforeUpdate: (nivel: any) => {
      nivel.actualizado_en = new Date();
    },
  },
});

export const Modulo = sequelize.define('modulos', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  nivel_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'niveles',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  slug: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'modulos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['nivel_id', 'slug'],
    },
    {
      unique: true,
      fields: ['nivel_id', 'orden'],
    },
  ],
  hooks: {
    beforeUpdate: (modulo: any) => {
      modulo.actualizado_en = new Date();
    },
  },
});

export const Leccion = sequelize.define('lecciones', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  modulo_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'modulos',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  contenido_json: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'lecciones',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['modulo_id', 'orden'],
    },
  ],
  hooks: {
    beforeUpdate: (leccion: any) => {
      leccion.actualizado_en = new Date();
    },
  },
});

export const Progreso = sequelize.define('progresos', {
  estudiante_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  leccion_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'lecciones',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  completado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  puntaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  completado_en: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'progresos',
  timestamps: false,
  hooks: {
    beforeUpdate: (progreso: any) => {
      progreso.actualizado_en = new Date();
    },
  },
});

export const Reporte = sequelize.define('reportes', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  clase_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'clases',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  estudiante_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  snapshot_json: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  generado_por: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reportes',
  timestamps: false,
});

// Relationships
Usuario.hasMany(Clase, { foreignKey: 'docente_id', as: 'ClasesImpartidas' });
Clase.belongsTo(Usuario, { foreignKey: 'docente_id', as: 'Docente' });

Clase.belongsToMany(Usuario, { through: ClaseEstudiante, foreignKey: 'clase_id', otherKey: 'estudiante_id', as: 'Estudiantes' });
Usuario.belongsToMany(Clase, { through: ClaseEstudiante, foreignKey: 'estudiante_id', otherKey: 'clase_id', as: 'ClasesInscritas' });

Nivel.hasMany(Modulo, { foreignKey: 'nivel_id', as: 'Modulos' });
Modulo.belongsTo(Nivel, { foreignKey: 'nivel_id', as: 'Nivel' });

Modulo.hasMany(Leccion, { foreignKey: 'modulo_id', as: 'Lecciones' });
Leccion.belongsTo(Modulo, { foreignKey: 'modulo_id', as: 'Modulo' });

Usuario.belongsToMany(Leccion, { through: Progreso, foreignKey: 'estudiante_id', otherKey: 'leccion_id', as: 'LeccionesProgreso' });
Leccion.belongsToMany(Usuario, { through: Progreso, foreignKey: 'leccion_id', otherKey: 'estudiante_id', as: 'EstudiantesProgreso' });

Usuario.hasMany(Reporte, { foreignKey: 'estudiante_id', as: 'ReportesEstudiante' });
Usuario.hasMany(Reporte, { foreignKey: 'generado_por', as: 'ReportesGenerados' });
Clase.hasMany(Reporte, { foreignKey: 'clase_id', as: 'Reportes' });
Reporte.belongsTo(Usuario, { foreignKey: 'estudiante_id', as: 'Estudiante' });
Reporte.belongsTo(Usuario, { foreignKey: 'generado_por', as: 'GeneradoPor' });
Reporte.belongsTo(Clase, { foreignKey: 'clase_id', as: 'Clase' });
