export interface User {
  id: number;
  google_id: string;
  email: string;
  name?: string;
  profile_picture?: string;
  created_at: string;
  preferences?: UserPreference;
}

export interface UserPreference {
  id: number;
  user_id: number;
  theme: 'light' | 'dark';
  notification_enabled: boolean;
  default_category: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mime_type: string;
  size: number;
  sender?: string;
  subject?: string;
  date?: string;
  message_id?: string;
}

export interface Email {
  id: string | number;
  gmail_message_id: string;
  thread_id?: string;
  sender: string;
  recipient?: string;
  subject: string;
  snippet: string;
  body_text?: string;
  body_html?: string;
  received_at: string;
  category: string;
  is_important: boolean;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  folder?: string;
  attachments?: Attachment[];
}

export interface SummarizeResponse {
  summary: string;
  category: string;
  important: boolean;
  action_items: string[];
  deadline?: string | null;
}

export interface ActionItem {
  id: number;
  user_id: number;
  email_id?: number;
  task: string;
  deadline?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Overdue';
  created_at: string;
  email_subject?: string;
}

export interface FollowUp {
  id: number;
  user_id: number;
  email_id?: number;
  recipient: string;
  subject?: string;
  sent_at: string;
  days_waiting: number;
  status: 'No response' | 'Resolved';
  created_at: string;
}

export interface DashboardStats {
  unread_count: number;
  important_count: number;
  today_count: number;
  pending_actions: number;
  waiting_replies: number;
}

export interface DashboardCharts {
  daily_emails: { day: string; received: number; sent: number }[];
  categories: { name: string; value: number; color: string }[];
  read_vs_unread: { name: string; value: number; color: string }[];
  important_vs_normal: { name: string; value: number; color: string }[];
}
