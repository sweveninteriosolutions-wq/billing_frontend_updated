export interface UserActivity {
  id: number;
  user_id?: number;
  username_snapshot: string;
  message: string;
  created_at: string;
}

export interface UserActivityFilters {
  user_id?: number;
  username?: string;
  page?: number;        // still sent TO backend
  page_size?: number;   // still sent TO backend
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UserActivityListResponse {
  total: number;
  items: UserActivity[];
}
