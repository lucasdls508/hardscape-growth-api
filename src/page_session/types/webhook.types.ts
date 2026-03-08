export interface LeadgenWebhookPayload {
  object: "page";
  entry: WebhookEntry[];
}

export interface WebhookEntry {
  id: string; // Page ID
  time: number; // Unix timestamp (seconds)
  changes: WebhookChange[];
}

export interface WebhookChange {
  field: "leadgen";
  value: LeadgenChangeValue;
}

export interface LeadgenChangeValue {
  created_time: number;
  leadgen_id: string;
  page_id: string;
  form_id: string;
}

// ── Messenger types ────────────────────────────────────────────────────────────

export interface MessengerEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
  };
}

export interface FacebookEntry {
  id: string;
  time: number;
  changes?: WebhookChange[];
  messaging?: MessengerEvent[];
}

export interface FacebookWebhookPayload {
  object: "page";
  entry: FacebookEntry[];
}
