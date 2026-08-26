import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('databasePath'),
        autoLoadEntities: true,
        // Em um projeto real usaríamos migrations. Para um sistema-alvo de
        // testes, sincronizar o schema automaticamente evita passo manual
        // extra ao subir cada instância nova (um grupo, um banco).
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
  ],
})
export class AppModule {}
