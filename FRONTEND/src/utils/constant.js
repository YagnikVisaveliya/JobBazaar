const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v2'

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || `${API_BASE_URL}/user`
export const JOBS_URL = import.meta.env.VITE_JOBS_URL || `${API_BASE_URL}/jobs`
export const APPLICATION_URL = import.meta.env.VITE_APPLICATION_URL || `${API_BASE_URL}/applications`
export const COMPANY_URL = import.meta.env.VITE_COMPANY_URL || `${API_BASE_URL}/company`