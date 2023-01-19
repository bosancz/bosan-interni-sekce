import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { snakeCase } from "change-case";
import { Request } from "express";
import * as path from "path";
import { AccessControlModule, AccessControlModuleOptions } from "./access-control/access-control.module";
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
import { Roles } from "./shared/schema/roles";

const typeOrmOptions: TypeOrmModuleOptions = {
  ...Config.db,
  autoLoadEntities: true,
};

const acOptions: AccessControlModuleOptions = {
  userRoles: (req: Request) => [Roles.verejnost, ...(req.user?.roles || [])],
  routeNameConvention: (methodName) => snakeCase(methodName).replace(/_/g, ":"),
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../frontend/dist"),
    }),
    TypeOrmModule.forRoot(typeOrmOptions),
    MongooseModule.forRoot(Config.mongoDb.uri),
    EventsModule,
    AccessControlModule.register(acOptions),
    EventsModule,
    PublicModule,
    MembersModule,
    AuthModule,
    MembersModelModule,
    AlbumsModelModule,
    UsersModelModule,
    AlbumsModule,
    MongoMigrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
