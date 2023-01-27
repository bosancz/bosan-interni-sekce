import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as path from "path";
import { AlbumsModule } from "./api/albums/albums.module";
import { EventsModule } from "./api/events/events.module";
import { MembersModule } from "./api/members/members.module";
import { PublicModule } from "./api/public/public.module";
import { AuthModule } from "./auth/auth.module";
import { Config } from "./config";
import { AlbumsModelModule } from "./models/albums/albums-model.module";
import { MembersModelModule } from "./models/members/members-model.module";
import { UsersModelModule } from "./models/users/users-model.module";
import { MongoMigrationModule } from "./mongo-migration/mongo-migration.module";
import { AccessControlModule } from './access-control/access-control.module';

const typeOrmOptions: TypeOrmModuleOptions = {
  ...Config.db,
  autoLoadEntities: true,
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../frontend/dist"),
    }),
    TypeOrmModule.forRoot(typeOrmOptions),
    MongooseModule.forRoot(Config.mongoDb.uri),
    EventsModule,
    EventsModule,
    PublicModule,
    MembersModule,
    AuthModule,
    MembersModelModule,
    AlbumsModelModule,
    UsersModelModule,
    AlbumsModule,
    MongoMigrationModule,
    AccessControlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
