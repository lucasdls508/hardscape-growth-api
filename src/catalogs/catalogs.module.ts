import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { CatalogsController } from "./catalogs.controller";
import { CatalogsService } from "./catalogs.service";
import { Catalogs } from "./enitities/catalogs.entity";

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Catalogs])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
