import Anthropic from "@anthropic-ai/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  FormFieldMessageClientContext,
  Message,
  RawMessageClientContext,
} from "src/chatbot/types/chatbot.types";
import { ChatbotUtilsService } from "src/chatbot/utils/chatbot.utils.service";

const SOPHIA_SYSTEM_PROMPT = `You are Sophia, an Inside Sales Agent for {businessName} in {city}. You work directly for {contractorName}.

Your mission: build rapport with hardscape leads, understand their project, and book an on-site estimate appointment.

RULES:
1. You are Sophia — a real person on the team. Never say you are an AI or bot unless the lead sincerely and directly asks "are you a robot?" or "are you AI?" — only then be honest.
2. Keep every response to 2–3 sentences. Warm, conversational, no corporate speak.
3. Always move toward booking an appointment. Every message should nudge that direction.
4. When the lead confirms a date/time, say it back clearly: "Perfect, I've got you down for [day] at [time] — {contractorName} will come out and take a look."
5. If you don't know pricing or specifics, say {contractorName} will cover that during the visit.
6. Never mention competitors, internal software, or that this conversation is automated.
7. Use the lead's name naturally when you know it.

Lead name: {leadName}
Contractor: {contractorName}
Business: {businessName}
City: {city}
Still need to collect: {missingFields}
Already collected: {collectedData}`;

@Injectable()
export class LangChainOpenAIService {
  private client: Anthropic;
  private readonly MODEL = "claude-sonnet-4-6";

  constructor(
    private _configService: ConfigService,
    private _chatbotUtils: ChatbotUtilsService
  ) {
    this.client = new Anthropic({
      apiKey: this._configService.get<string>("ANTHROPIC_API_KEY"),
    });
  }

  async generateResponse(
    clientContext: RawMessageClientContext | FormFieldMessageClientContext,
    userMessage: string
  ): Promise<string> {
    const userInfo = this._chatbotUtils.extractClientUserInfo(clientContext);
    const leadName = this._getLeadName(clientContext.collectedData);
    const city = this._configService.get<string>("BUSINESS_CITY") ?? "your area";

    const system = SOPHIA_SYSTEM_PROMPT
      .replace(/{businessName}/g, userInfo.buisness_name || "our company")
      .replace(/{contractorName}/g, `${userInfo.first_name} ${userInfo.last_name}`.trim() || "our team")
      .replace(/{city}/g, city)
      .replace(/{leadName}/g, leadName)
      .replace(/{missingFields}/g, this._getMissingFields(clientContext))
      .replace(/{collectedData}/g, this._formatCollectedData(clientContext.collectedData));

    const messages = this._buildHistory(clientContext.conversationHistory, userMessage);

    const response = await this.client.messages.create({
      model: this.MODEL,
      max_tokens: 256,
      system,
      messages,
    });

    const block = response.content[0];
    return block.type === "text" ? block.text.trim() : "";
  }

  async extractStructuredData(
    userMessage: string,
    formFields: { name: string; values: string[] }[]
  ): Promise<Map<string, string>> {
    const fieldList = formFields.map((f) => `- ${f.name}`).join("\n");

    const response = await this.client.messages.create({
      model: this.MODEL,
      max_tokens: 512,
      system: `Extract information from the user message. Respond ONLY with valid JSON: {"extracted": {"field_name": "value"}}. Only include fields clearly present. Do not guess or invent values.`,
      messages: [
        {
          role: "user",
          content: `Fields to extract:\n${fieldList}\n\nUser message: "${userMessage}"`,
        },
      ],
    });

    return this._parseJson(response);
  }

  async extractStructuredInformation(userMessage: string): Promise<Map<string, string>> {
    const response = await this.client.messages.create({
      model: this.MODEL,
      max_tokens: 256,
      system: `Extract contact info from the message. Respond ONLY with valid JSON: {"extracted": {"name": "...", "email": "...", "phone": "..."}}. Only include fields clearly present.`,
      messages: [{ role: "user", content: `Message: "${userMessage}"` }],
    });

    return this._parseJson(response);
  }

  async extractAppointmentDateTime(
    sophiaResponse: string
  ): Promise<{ start_time: string; end_time: string } | null> {
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await this.client.messages.create({
        model: this.MODEL,
        max_tokens: 128,
        system: `Extract the appointment date and time from the confirmation message. Today is ${today}. Respond ONLY with valid JSON: {"start_time":"YYYY-MM-DDTHH:MM:00","end_time":"YYYY-MM-DDTHH:MM:00"}. Set end_time to 1 hour after start_time. If no clear datetime is found, respond with {"start_time":null}.`,
        messages: [{ role: "user", content: sophiaResponse }],
      });

      const block = response.content[0];
      if (block.type !== "text") return null;
      const match = block.text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      const parsed = JSON.parse(match[0]);
      if (!parsed.start_time) return null;
      return { start_time: parsed.start_time, end_time: parsed.end_time };
    } catch {
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const r = await this.client.messages.create({
        model: this.MODEL,
        max_tokens: 16,
        messages: [{ role: "user", content: "Hi" }],
      });
      return r.content.length > 0;
    } catch {
      return false;
    }
  }

  // ─── private helpers ──────────────────────────────────────────────────────

  private _getLeadName(data: Map<string, string>): string {
    const candidates = ["full_name", "FULL_NAME", "FIRST_NAME", "first_name", "name"];
    for (const key of candidates) {
      const found = [...data.keys()].find((k) => k.toLowerCase() === key.toLowerCase());
      if (found) return data.get(found) ?? "there";
    }
    return "there";
  }

  private _getMissingFields(context: RawMessageClientContext | FormFieldMessageClientContext): string {
    if (!("formData" in context) || !context.formData?.length) return "none";
    const missing = context.formData
      .filter((f) => !context.collectedData.has(f.name))
      .map((f) => f.name);
    return missing.length ? missing.join(", ") : "none";
  }

  private _formatCollectedData(data: Map<string, string>): string {
    if (!data.size) return "none yet";
    return [...data.entries()].map(([k, v]) => `${k}: ${v}`).join(", ");
  }

  private _buildHistory(history: Message[], userMessage: string): Anthropic.MessageParam[] {
    const recent = history.slice(-6);
    const msgs: Anthropic.MessageParam[] = recent.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));
    msgs.push({ role: "user", content: userMessage });
    return msgs;
  }

  private _parseJson(response: Anthropic.Message): Map<string, string> {
    const result = new Map<string, string>();
    try {
      const block = response.content[0];
      if (block.type !== "text") return result;
      const match = block.text.match(/\{[\s\S]*\}/);
      if (!match) return result;
      const parsed = JSON.parse(match[0]);
      Object.entries(parsed.extracted ?? {}).forEach(([k, v]) => {
        if (v && typeof v === "string") result.set(k, v);
      });
    } catch {
      // return empty map on any parse failure
    }
    return result;
  }
}
