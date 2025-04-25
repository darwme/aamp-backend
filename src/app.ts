import express from 'express';
import morgan from 'morgan';
import { authRoutes } from './interfaces/routes/auth.routes';
import { mothersRoutes } from './interfaces/routes/mothers.routes';
import { errorHandler } from './interfaces/middleware/error.middleware';
import { dbConnection } from './infrastructure/database/connection';
import cors from 'cors';
import chokidar from 'chokidar';
import path from 'path';
import { rolesRoutes } from './interfaces/routes/roles.routes';
import dniRoutes from './interfaces/routes/dni.routes'; // Importa las rutas de DNI

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).send({
    message: 'Service is healthy',
    status: 'success',
    data: { service: 'AAMP Backend Health is OK' }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/mothers', mothersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/dni', dniRoutes); // Registra las rutas de DNI

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Servidor monolítico de Auth y Usuario está corriendo',
    status: 'success',
    data: null
  });
});

app.use(errorHandler);

let server: any;

const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Rutas Auth disponibles en: http://localhost:${PORT}/api/auth/*`);
    console.log(`Rutas Usuario disponibles en: http://localhost:${PORT}/api/usuario/*`);
  });
};

const watchForChanges = () => {
  if (!isDev) return;
  const watchPath = path.join(process.cwd(), 'src', '**', '*.{ts,js}');
  console.log(`👀 Observando cambios en: ${watchPath}`);

  const watcher = chokidar.watch(watchPath, {
    ignored: /node_modules/,
    persistent: true
  });

  watcher.on('change', (changedPath) => {
    console.log(`🔄 Archivo modificado: ${changedPath}`);
    console.log('Reiniciando servidor...');

    if (server) {
      server.close(() => {
        console.log('Servidor cerrado.');
        server = null; // se agrega para liberar el puerto
        Object.keys(require.cache).forEach(id => {
          if (id.includes(path.join(process.cwd(), 'src'))) {
            delete require.cache[id];
          }
        });
        setTimeout(() => {
          try {
            startServer();
            console.log('Servidor reiniciado correctamente');
          } catch (error) {
            console.error('Error al reiniciar el servidor:', error);
          }
        }, 1000);
      });
    }
  });
};

// dbConnection.connect()
//   .then(() => {
//     startServer();
//     watchForChanges();
//   })
//   .catch(error => {
//     console.error('Fallo al conectar a la base de datos:', error.message);
//     console.error('La aplicación se cerrará debido a la falla de conexión.');
//     setTimeout(() => process.exit(1), 1000);
//   });

startServer();
watchForChanges();

export default app;
