import { sequelize, Usuario, Clase, ClaseEstudiante, Nivel, Modulo, Leccion, Progreso, Reporte } from './database';

import bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS) : 10);
  return bcrypt.hash(password, salt);
}

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    await sequelize.sync({ force: false });

    const userCount = await Usuario.count();
    if (userCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Seed niveles
    console.log('=� Seeding niveles...');
    const niveles = await Nivel.bulkCreate([
      { codigo: '1A', nombre: 'Nivel 1A' },
      { codigo: '1B', nombre: 'Nivel 1B' },
      { codigo: '2A', nombre: 'Nivel 2A' },
      { codigo: '2B', nombre: 'Nivel 2B' },
      { codigo: '3A', nombre: 'Nivel 3A' },
      { codigo: '3B', nombre: 'Nivel 3B' },
    ], { ignoreDuplicates: true });

    // Get nivel 1A for modulos
    const nivel1A = await Nivel.findOne({ where: { codigo: '1A' } });
    const nivel1B = await Nivel.findOne({ where: { codigo: '1B' } });

    // Seed modulos for nivel 1A
    console.log('=� Seeding modulos...');
    const modulos1A = await Modulo.bulkCreate([
      { nivel_id: nivel1A?.id, slug: 'abecedario', titulo: 'Abecedario', orden: 1 },
      { nivel_id: nivel1A?.id, slug: 'numeros', titulo: 'N�meros', orden: 2 },
      { nivel_id: nivel1A?.id, slug: 'vocales', titulo: 'Vocales', orden: 3 },
      { nivel_id: nivel1A?.id, slug: 'colores', titulo: 'Colores', orden: 4 },
      { nivel_id: nivel1A?.id, slug: 'dias', titulo: 'D�as de la semana', orden: 5 },
      { nivel_id: nivel1A?.id, slug: 'meses', titulo: 'Meses del a�o', orden: 6 },
      { nivel_id: nivel1A?.id, slug: 'animales', titulo: 'Animales', orden: 7 },
    ], { ignoreDuplicates: true });

    // Seed modulos for nivel 1B
    const modulos1B = await Modulo.bulkCreate([
      { nivel_id: nivel1B?.id, slug: 'familia', titulo: 'La Familia', orden: 1 },
      { nivel_id: nivel1B?.id, slug: 'cuerpo', titulo: 'Partes del Cuerpo', orden: 2 },
      { nivel_id: nivel1B?.id, slug: 'comida', titulo: 'Comida y Bebidas', orden: 3 },
      { nivel_id: nivel1B?.id, slug: 'casa', titulo: 'La Casa', orden: 4 },
      { nivel_id: nivel1B?.id, slug: 'ropa', titulo: 'Ropa', orden: 5 },
    ], { ignoreDuplicates: true });

    // Seed lecciones for each modulo
    console.log('=� Seeding lecciones...');
    const allModulos = await Modulo.findAll();

    for (const modulo of allModulos) {
      const leccionesData = [
        {
          modulo_id: modulo.id,
          orden: 1,
          titulo: `${modulo.titulo} - Introducci�n`,
          contenido_json: {
            tipo: 'introduccion',
            descripcion: `Bienvenido al m�dulo de ${modulo.titulo}`,
            objetivos: [
              `Aprender vocabulario b�sico de ${modulo.titulo.toLowerCase()}`,
              'Practicar pronunciaci�n',
              'Realizar ejercicios interactivos'
            ]
          }
        },
        {
          modulo_id: modulo.id,
          orden: 2,
          titulo: `${modulo.titulo} - Vocabulario`,
          contenido_json: {
            tipo: 'vocabulario',
            palabras: generateVocabulary(modulo.slug),
            ejercicios: [
              'Asociaci�n de im�genes',
              'Completar palabras',
              'Pronunciaci�n'
            ]
          }
        },
        {
          modulo_id: modulo.id,
          orden: 3,
          titulo: `${modulo.titulo} - Pr�ctica`,
          contenido_json: {
            tipo: 'practica',
            actividades: [
              'Ejercicios de selecci�n m�ltiple',
              'Ordenar letras',
              'Escuchar y repetir'
            ]
          }
        },
        {
          modulo_id: modulo.id,
          orden: 4,
          titulo: `${modulo.titulo} - Evaluaci�n`,
          contenido_json: {
            tipo: 'evaluacion',
            preguntas: 10,
            tiempo_limite: 300,
            puntaje_minimo: 70
          }
        }
      ];

      await Leccion.bulkCreate(leccionesData, { ignoreDuplicates: true });
    }

    // Seed usuarios (teachers and admins)
    console.log('=e Seeding usuarios...');
    const usuarios = await Usuario.bulkCreate([
      {
        usuario: 'admin',
        email: 'admin@elearning.com',
        password_hash: await hashPassword('admin123'),
        rol: 'admin',
        nombre: 'Administrador',
        apellido: 'Sistema'
      },
      {
        usuario: 'teacher1',
        email: 'teacher1@elearning.com',
        password_hash: await hashPassword('teacher123'),
        rol: 'docente',
        nombre: 'Maria',
        apellido: 'Gonzalez'
      },
      {
        usuario: 'teacher2',
        email: 'teacher2@elearning.com',
        password_hash: await hashPassword('teacher123'),
        rol: 'docente',
        nombre: 'Carlos',
        apellido: 'Rodriguez'
      },
      {
        usuario: 'student1',
        email: 'student1@elearning.com',
        password_hash: await hashPassword('student123'),
        rol: 'estudiante',
        nombre: 'Ana',
        apellido: 'Lopez'
      },
      {
        usuario: 'student2',
        email: 'student2@elearning.com',
        password_hash: await hashPassword('student123'),
        rol: 'estudiante',
        nombre: 'Pedro',
        apellido: 'Martinez'
      },
      {
        usuario: 'student3',
        email: 'student3@elearning.com',
        password_hash: await hashPassword('student123'),
        rol: 'estudiante',
        nombre: 'Sofia',
        apellido: 'Hernandez'
      }
    ], {
      ignoreDuplicates: true,
      individualHooks: true
    });

    // Get teacher and students for clase creation
    const teacher1 = await Usuario.findOne({ where: { usuario: 'teacher1' } });
    const teacher2 = await Usuario.findOne({ where: { usuario: 'teacher2' } });
    const students = await Usuario.findAll({ where: { rol: 'estudiante' } });

    // Seed clases
    console.log('<� Seeding clases...');
    const clases = await Clase.bulkCreate([
      {
        codigo: 'CLASE001',
        nombre: 'Ingl�s B�sico - Grupo A',
        docente_id: teacher1?.id,
        grado: '1ro',
        seccion: 'A',
        jornada: 'Ma�ana'
      },
      {
        codigo: 'CLASE002',
        nombre: 'Ingl�s B�sico - Grupo B',
        docente_id: teacher2?.id,
        grado: '1ro',
        seccion: 'B',
        jornada: 'Tarde'
      },
      {
        codigo: 'CLASE003',
        nombre: 'Ingl�s Intermedio - Grupo A',
        docente_id: teacher1?.id,
        grado: '2do',
        seccion: 'A',
        jornada: 'Ma�ana'
      }
    ], { ignoreDuplicates: true });

    // Assign students to classes
    console.log('👨‍🎓 Assigning students to classes...');
    const clase1 = await Clase.findOne({ where: { codigo: 'CLASE001' } });
    const clase2 = await Clase.findOne({ where: { codigo: 'CLASE002' } });

    if (clase1 && students.length > 0) {
      await ClaseEstudiante.bulkCreate([
        { clase_id: clase1.id, estudiante_id: students[0].id },
        { clase_id: clase1.id, estudiante_id: students[1].id }
      ], { ignoreDuplicates: true });
    }

    if (clase2 && students.length > 2) {
      await ClaseEstudiante.create({
        clase_id: clase2.id,
        estudiante_id: students[2].id
      });
    }

    // Create some sample progress
    console.log('=� Seeding progress data...');
    const someLecciones = await Leccion.findAll({ limit: 5 });

    for (const student of students.slice(0, 2)) {
      for (const leccion of someLecciones.slice(0, 3)) {
        await Progreso.create({
          estudiante_id: student.id,
          leccion_id: leccion.id,
          completado: Math.random() > 0.5,
          puntaje: Math.floor(Math.random() * 40) + 60, // 60-100
          completado_en: Math.random() > 0.5 ? new Date() : null
        });
      }
    }

    // Create sample reports
    console.log('=� Seeding reports...');
    if (clase1 && teacher1) {
      await Reporte.create({
        clase_id: clase1.id,
        snapshot_json: {
          tipo: 'progreso_clase',
          fecha_generacion: new Date().toISOString(),
          estudiantes_total: 2,
          lecciones_completadas: 15,
          promedio_puntaje: 85.5,
          estudiantes_progreso: [
            { nombre: 'Ana L�pez', lecciones_completadas: 8, promedio: 90 },
            { nombre: 'Pedro Mart�nez', lecciones_completadas: 7, promedio: 81 }
          ]
        },
        generado_por: teacher1.id
      });
    }

    console.log(' Database seeding completed successfully!');
    console.log(`=� Created ${niveles.length} niveles`);
    console.log(`=� Created ${modulos1A.length + modulos1B.length} modulos`);
    console.log(`=� Created multiple lecciones for each modulo`);
    console.log(`=e Created ${usuarios.length} usuarios`);
    console.log(`<� Created ${clases.length} clases`);
    console.log('=� Created sample progress and reports');

  } catch (error) {
    console.error('L Error seeding database:', error);
    throw error;
  }
}

function generateVocabulary(slug: string) {
  const vocabularies: { [key: string]: string[] } = {
    abecedario: ['A - Apple', 'B - Ball', 'C - Cat', 'D - Dog', 'E - Elephant'],
    numeros: ['One - Uno', 'Two - Dos', 'Three - Tres', 'Four - Cuatro', 'Five - Cinco'],
    vocales: ['A - /ej/', 'E - /i�/', 'I - /aj/', 'O - /o�/', 'U - /ju�/'],
    colores: ['Red - Rojo', 'Blue - Azul', 'Green - Verde', 'Yellow - Amarillo', 'Orange - Naranja'],
    dias: ['Monday - Lunes', 'Tuesday - Martes', 'Wednesday - Mi�rcoles', 'Thursday - Jueves', 'Friday - Viernes'],
    meses: ['January - Enero', 'February - Febrero', 'March - Marzo', 'April - Abril', 'May - Mayo'],
    animales: ['Cat - Gato', 'Dog - Perro', 'Bird - P�jaro', 'Fish - Pez', 'Horse - Caballo'],
    familia: ['Mother - Madre', 'Father - Padre', 'Sister - Hermana', 'Brother - Hermano', 'Grandmother - Abuela'],
    cuerpo: ['Head - Cabeza', 'Eyes - Ojos', 'Nose - Nariz', 'Mouth - Boca', 'Hands - Manos'],
    comida: ['Apple - Manzana', 'Bread - Pan', 'Water - Agua', 'Milk - Leche', 'Rice - Arroz'],
    casa: ['House - Casa', 'Room - Habitaci�n', 'Kitchen - Cocina', 'Bathroom - Ba�o', 'Garden - Jard�n'],
    ropa: ['Shirt - Camisa', 'Pants - Pantalones', 'Shoes - Zapatos', 'Hat - Sombrero', 'Dress - Vestido']
  };

  return vocabularies[slug] || ['Sample - Ejemplo', 'Word - Palabra', 'Learning - Aprendizaje'];
}
