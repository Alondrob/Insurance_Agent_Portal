import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CLAIM_MOCK_DATA } from '../claim-mock-data';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private claims = CLAIM_MOCK_DATA;

  constructor() {}

  getClaims(filterCriteria: any): Observable<any> {
    let filteredClaims = this.claims;

    if (filterCriteria.fromDate) {
      const fromDate = new Date(filterCriteria.fromDate);
      filteredClaims = filteredClaims.filter(claim => new Date(claim.date) >= fromDate);
    }

    if (filterCriteria.toDate) {
      const toDate = new Date(filterCriteria.toDate);
      filteredClaims = filteredClaims.filter(claim => new Date(claim.date) <= toDate);
    }

    const start = (filterCriteria.page - 1) * filterCriteria.pageSize;
    const end = start + filterCriteria.pageSize;
    const paginatedClaims = filteredClaims.slice(start, end);

    return of({
      claims: paginatedClaims,
      total: filteredClaims.length,
      page: filterCriteria.page,
      pageSize: filterCriteria.pageSize
    });
  }
}

