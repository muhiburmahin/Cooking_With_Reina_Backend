import { Server } from 'http';
import app from './app';
import config from './app/config';
import prisma from './shared/prisma';

async function bootstrap() {
  let server: Server;

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is flying on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log('⚠️ Server closed safely');
        });
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error('❌ Unexpected Error:', error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received');
      if (server) {
        server.close();
      }
    });

  } catch (error) {
    console.error('❌ Failed to connect database:', error);
    process.exit(1);
  }
}

bootstrap();