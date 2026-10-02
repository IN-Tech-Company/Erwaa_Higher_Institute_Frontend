import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTraineeRequest,
  SetTraineePasswordRequest,
  Trainee,
  TraineeFilters,
  UpdateTraineeRequest,
} from '../models/admin-trainees.models';
import { PageResponse } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminTraineesService {
  private readonly api = inject(ApiService);
  private readonly baseUrl = '/admin/trainees';

  list(filters: TraineeFilters, size = 20): Observable<PageResponse<Trainee>> {
    const params: Record<string, string | number | boolean> = { page: filters.page, size };
    if (filters.search) params['search'] = filters.search;
    if (filters.enabled !== null) params['enabled'] = filters.enabled;
    return this.api.get(this.baseUrl, params);
  }

  get(id: number): Observable<Trainee> {
    return this.api.get(`${this.baseUrl}/${id}`);
  }

  create(body: CreateTraineeRequest): Observable<Trainee> {
    return this.api.post(this.baseUrl, body);
  }

  update(id: number, body: UpdateTraineeRequest): Observable<Trainee> {
    return this.api.put(`${this.baseUrl}/${id}`, body);
  }

  enable(id: number): Observable<Trainee> {
    return this.api.patch(`${this.baseUrl}/${id}/enable`);
  }

  disable(id: number): Observable<Trainee> {
    return this.api.patch(`${this.baseUrl}/${id}/disable`);
  }

  setPassword(id: number, body: SetTraineePasswordRequest): Observable<void> {
    return this.api.put(`${this.baseUrl}/${id}/password`, body);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }
}
