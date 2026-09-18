export type AnalyticsGranularity = 'DAY' | 'MONTH';

export interface AnalyticsTrendPoint {
  period: string;
  count: number;
  revenue: number;
}

export interface AnalyticsByStatus {
  status: string;
  count: number;
}

export interface AnalyticsByService {
  serviceId: number;
  serviceNameAr: string;
  serviceNameEn: string;
  count: number;
  revenue: number;
}

export interface AnalyticsByClientType {
  clientType: string;
  count: number;
}

export interface AnalyticsByPaymentMethod {
  paymentMethod: string;
  count: number;
}

export interface AnalyticsPeakHour {
  hour: number;
  count: number;
}

export interface AnalyticsSummary {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  activeBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  completionRate: number;
  cancellationRate: number;
}

export interface BookingAnalyticsResponse {
  summary: AnalyticsSummary;
  trend: AnalyticsTrendPoint[];
  byStatus: AnalyticsByStatus[];
  byService: AnalyticsByService[];
  byClientType: AnalyticsByClientType[];
  byPaymentMethod: AnalyticsByPaymentMethod[];
  peakHours: AnalyticsPeakHour[];
}

export interface AnalyticsFilter {
  executorId?: number;
  dateFrom?: string;
  dateTo?: string;
  granularity?: AnalyticsGranularity;
}
