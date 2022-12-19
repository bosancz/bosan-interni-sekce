import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { EventsModule } from "./api/events/events.module";
import { PublicModule } from "./api/public/public.module";
import { AccessControlModule } from "./models/access-control/access-control.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../frontend/dist"),
    }),
    EventsModule,
    AccessControlModule,
    EventsModule,
    PublicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}