// Schema for storing analytics data in Firestore
// Collection: analytics
// Documents: daily, weekly, monthly

export interface DailyAnalytics {
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
  sessionDuration: number; // in seconds
  bounceRate: number;
  pageViews: { [page: string]: number };
  referrers: { [referrer: string]: number };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  timestamp: number; // Firebase server timestamp
}

export interface WeeklyAnalytics {
  week: string; // YYYY-W##
  startDate: string;
  endDate: string;
  totalViews: number;
  totalUniqueVisitors: number;
  avgSessionDuration: number;
  avgBounceRate: number;
  topPages: { [page: string]: number };
  topReferrers: { [referrer: string]: number };
}

export interface MonthlyAnalytics {
  month: string; // YYYY-MM
  totalViews: number;
  totalUniqueVisitors: number;
  avgSessionDuration: number;
  avgBounceRate: number;
  topPages: { [page: string]: number };
  topReferrers: { [referrer: string]: number };
}

// Helper function to format date as YYYY-MM-DD
export function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to get week number
export function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return `${d.getUTCFullYear()}-W${String(Math.ceil((d.getTime() - yearStart.getTime()) / 86400000 / 7)).padStart(2, '0')}`;
}

// Helper function to get month string
export function getMonthString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

