require('dotenv').config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ConfigModule, registerAs } from '@nestjs/config';
import { InventoryModule } from './inventory/inventory.module';
import { MissionModule } from './mission/mission.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type:     'postgres',
      host:     `${process.env.DATABASE_HOST          || 'localhost' }`,
      port:     parseInt(process.env.DATABASE_PORT)   || 5432,
      username: `${process.env.DATABASE_USER          || 'root' }`,
      password: `${process.env.DATABASE_PASSWORD      || '' }`,
      database: `${process.env.DATABASE               || 'gather' }`,
      entities: [
        __dirname + "/**/*.entity{.ts,.js}",
        // "src/entity/**/*.ts",
        // "dist/**/*.entity{.ts,.js}"
      ],
      migrations: [
        __dirname + "/../migrations/*.{ts,js}"
      ],
      synchronize: true,
    }),
    WarehouseModule,
    InventoryModule,
    MissionModule,
    UsersModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})

export class AppModule {}