import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRoles } from "src/user/enums/role.enum";
import { Repository } from "typeorm";
import { Lead } from "../entities/lead.entity";

@Injectable()
export class LeadsQueryService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>
  ) {}

  /* ----------------------------------------
   * GET USER LEADS (Paginated)
   * --------------------------------------*/
  async getUserLeads({
    userId,
    role = ["agency_owner"], // agency | contractor
    page = 1,
    limit = 10,
    status,
    is_used,
  }: {
    userId: string;
    role?: string[];
    page?: number;
    limit?: number;
    status?: string;
    is_used?: boolean;
  }) {
    const qb = this.leadRepo.createQueryBuilder("lead");

    if (role.includes(UserRoles.AGENCY_OWNER)) {
      qb.where("lead.agency_id = :userId", { userId });
    } else {
      qb.where("lead.contructor_id = :userId", { userId });
    }

    qb.andWhere("lead.deleted_at IS NULL");

    if (status) {
      qb.andWhere("lead.status = :status", { status });
    }

    if (typeof is_used === "boolean") {
      qb.andWhere("lead.is_used = :is_used", { is_used });
    }
    qb.leftJoinAndSelect("lead.conversation", "conversation");
    qb.select([
      "lead.id",
      "lead.name",
      "lead.email",
      "lead.phone",
      "lead.project_details",
      "lead.status",
      "lead.is_used",
      "lead.created_at",
      "conversation.id",
      "conversation.lead_phone",
      "conversation.created_at",
    ]);
    qb.orderBy("lead.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
