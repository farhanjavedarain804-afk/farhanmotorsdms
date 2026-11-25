// Farhan Motors MySQL Database & API Client
// Completely replaces Supabase with local Express + MySQL backend
import { apiClient, supabase as client } from '@/lib/apiClient';

export const supabase = client;
export { apiClient };
