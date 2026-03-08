import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { UserAddress } from "../entities/userAddresses.entity";
import { Verification } from "../entities/verification.entity";
import { ContructorsController } from "./contructors.controller";
import { ContructorsService } from "./contructors.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, UserAddress])],
  controllers: [ContructorsController],
  providers: [ContructorsService],
  exports: [ContructorsService],
})
export class ContructorsModule {}
