// estimate-renderer.service.ts
// Compiles the .hbs template once at startup, renders per estimate.
// Works with Fastify — no Express dependency.

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import fs from "fs";
import Handlebars from "handlebars";
import * as path from "path";
import { Estimates } from "./entities/estimates.entity";
@Injectable()
export class EstimateRendererService implements OnModuleInit {
  private readonly logger = new Logger(EstimateRendererService.name);
  private compiledTemplate: HandlebarsTemplateDelegate;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const templatePath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "src/estimates/templates",
      "estimate.template.hbs"
    );
    console.log(templatePath);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`HBS template not found at: ${templatePath}`);
    }
    const source = fs.readFileSync(templatePath, "utf-8");
    this.compiledTemplate = Handlebars.compile(source);
    this.logger.log("Estimate HBS template compiled and cached");
  }

  /**
   * Render a full HTML string from a loaded Estimates entity.
   * Relations required: estimate_catalogs.catalog, prepared_by_user, lead
   */
  render(estimate: Estimates): string {
    const lead = estimate.lead;
    const preparedBy = estimate.prepared_by_user
      ? `${estimate.prepared_by_user.first_name} ${estimate.prepared_by_user.last_name}`
      : "Contractor";

    const issuedDate = new Date(estimate.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Pre-compute line items and totals — keeps the template logic-free
    let totalCost = 0;
    let totalPrice = 0;

    const catalogItems = (estimate.estimate_catalogs ?? []).map((item, i) => {
      const qty = parseFloat(item.quantity as any);
      const cost = parseFloat(item.unit_cost as any);
      const price = parseFloat(item.unit_price as any);
      const rowTotal = qty * price;

      totalCost += qty * cost;
      totalPrice += rowTotal;

      return {
        rowIndex: i + 1,
        name: item.catalog?.name ?? "",
        desc: item.catalog?.desc ?? "",
        quantity: qty,
        unitCost: cost.toFixed(2),
        unitPrice: price.toFixed(2),
        rowTotal: rowTotal.toFixed(2),
      };
    });

    const apiBase = this.config.get<string>("BASE_URL", "http://localhost:4500");

    return this.compiledTemplate({
      estimate,
      lead,
      preparedBy,
      issuedDate,
      catalogItems,
      totalCost: totalCost.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      apiBase,
      // Boolean flag used by {{#if isSigned}} / {{#unless isSigned}} in the template
      isSigned: !!estimate.lead_signature,
    });
  }
}
