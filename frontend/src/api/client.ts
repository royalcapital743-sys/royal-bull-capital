const rawApiUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '').trim();
let normalizedBase = rawApiUrl;
if (normalizedBase && !normalizedBase.startsWith('http://') && !normalizedBase.startsWith('https://')) {
  normalizedBase = `https://${normalizedBase}`;
}
const API_BASE = normalizedBase 
  ? (normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`) 
  : '/api';

export function formatMoney(cents: number | undefined | null): string {
  const val = Number(cents || 0) / 100;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
  return `${formatted} USD`;
}

export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('royalbull_access_token');
    const headers = new Headers(options.headers || {});

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response = await fetch(`${API_BASE}${endpoint}`, config);

    // Auto refresh on 401
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      const refreshToken = localStorage.getItem('royalbull_refresh_token');
      if (refreshToken) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem('royalbull_access_token', refreshData.access_token);
              localStorage.setItem('royalbull_refresh_token', refreshData.refresh_token);
              this.isRefreshing = false;
              this.onRefreshed(refreshData.access_token);
            } else {
              this.isRefreshing = false;
              localStorage.removeItem('royalbull_access_token');
              localStorage.removeItem('royalbull_refresh_token');
              window.location.href = '/login?expired=1';
              throw new Error('Session expired. Please log in again.');
            }
          } catch (err) {
            this.isRefreshing = false;
            localStorage.removeItem('royalbull_access_token');
            localStorage.removeItem('royalbull_refresh_token');
            window.location.href = '/login?expired=1';
            throw err;
          }
        }

        // Retry with new token once refresh finishes
        const retryToken = await new Promise<string>((resolve) => {
          this.addRefreshSubscriber((newToken) => resolve(newToken));
        });
        headers.set('Authorization', `Bearer ${retryToken}`);
        response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      }
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.message || `Request failed with status ${response.status}`);
    }
    return data as T;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
