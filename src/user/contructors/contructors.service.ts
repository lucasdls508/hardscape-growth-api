import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { AgencyProfile } from "src/agency_profiles/entities/agency_profiles.entity";
import { argon2hash } from "src/utils/hashes/argon2";
import { DataSource } from "typeorm";
import { AccountStatus } from "../dto/verification-dto";
import { User } from "../entities/user.entity";
import { UserRoles } from "../enums/role.enum";
import { CreateMemberDto } from "./dto/CreateAgencyMembers.dto";

@Injectable()
export class ContructorsService {
  constructor(private _dataSource: DataSource) {}

  async createMember(createMemberDto: CreateMemberDto, agencyId: string) {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, email, ...rest } = createMemberDto;

      // 1. Verify the Agency exists
      const agency = await queryRunner.manager.findOne(AgencyProfile, {
        where: { id: agencyId },
      });
      if (!agency) throw new NotFoundException("Agency profile not found");

      // 2. Hash password
      const hashedPassword = await argon2hash(password);

      // 3. Create User with CONSTRUCTOR role and link to Agency
      const user = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          ...rest,
          email,
          password: hashedPassword,
          roles: [UserRoles.CONTRUCTOR], // Forced role
          works_for_agency: agency, // Link to the Hub
          is_active: true, // Usually active if added by admin
        })
        .returning("id, first_name, last_name, email, roles, status")
        .execute();

      const newUser = user.raw[0];

      // 4. Create Verification Record (Standard procedure)
      await queryRunner.manager.insert("verifications", {
        user_id: newUser.id,
        status: AccountStatus.ACTIVE, // Often active immediately if invited
      });

      await queryRunner.commitTransaction();

      // 5. Post-transaction tasks
      //   const token = await this.signTokenSendEmailAndSMS(newUser);

      // Notify the member they've been added to an agency
      //   await this._otpQueue.add("member_invite", {
      //     user: newUser,
      //     agencyName: agency.agency_name,
      //   });

      return {
        ok: true,
        message: "Member created successfully",
        data: newUser,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === "23505") {
        throw new ConflictException("Email already exists");
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
