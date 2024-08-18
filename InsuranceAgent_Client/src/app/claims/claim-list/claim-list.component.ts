import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../shared/custom-table/custom-table.component';
import { FilterModalComponent } from '../../shared/components/filter-modal/filter-modal.component';
import { ClaimCreateComponent } from '../claim-create/claim-create.component';
import { Claim } from '../claim.model';
import { ClaimsService } from '../claim.service';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [CommonModule, CustomTableComponent, FilterModalComponent, ClaimCreateComponent],
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css'],
})
export class ClaimListComponent implements OnInit {
  claims: Claim[] = [];
  displayedClaims: Claim[] = []; // Claims currently displayed in the table
  isFilterModalOpen: boolean = false;
  isCreateClaimModalOpen: boolean = false;
  filterField: string = '';
  filterCriteria = {
    fromDate: '',
    toDate: '',
    page: 1,
    pageSize: 10,
  };
  totalClaims: number = 0;

  constructor(private claimsService: ClaimsService) {}
  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.claimsService.getClaims(this.filterCriteria).subscribe((response) => {
      this.claims = response.claims;
      this.totalClaims = response.total;
      this.displayedClaims = this.claims.slice(0, this.filterCriteria.pageSize); // Initially display the first page
    });
  }

  openFilterModal(field: string): void {
    this.filterField = field;
    this.isFilterModalOpen = true;
  }

  closeFilterModal(): void {
    this.isFilterModalOpen = false;
  }

    openCreateClaimModal(): void {
    this.isCreateClaimModalOpen = true;
  }

  closeCreateClaimModal(): void {
    this.isCreateClaimModalOpen = false;
  }

  applyFilters(filterValues: any): void {
    this.filterCriteria = { ...this.filterCriteria, ...filterValues, page: 1 };

    // Attempt to filter the current dataset
    const filteredClaims = this.filterClaimsLocally();

    if (filteredClaims.length > 0) {
      // Update the displayed claims if matches are found
      this.displayedClaims = filteredClaims.slice(
        0,
        this.filterCriteria.pageSize
      );
    } else {
      // Fetch from the backend if no local matches are found
      this.fetchFilteredClaimsFromBackend();
    }
  }

  filterClaimsLocally(): Claim[] {
    return this.claims.filter((claim) => {
      const fromDate = this.filterCriteria.fromDate
        ? new Date(this.filterCriteria.fromDate)
        : null;
      const toDate = this.filterCriteria.toDate
        ? new Date(this.filterCriteria.toDate)
        : null;

      const claimDate = new Date(claim.date);

      if (fromDate && claimDate < fromDate) {
        return false;
      }
      if (toDate && claimDate > toDate) {
        return false;
      }
      return true;
    });
  }

  fetchFilteredClaimsFromBackend(): void {
    this.claimsService.getClaims(this.filterCriteria).subscribe((response) => {
      this.claims = response.claims;
      this.totalClaims = response.total;
      this.displayedClaims = this.claims.slice(0, this.filterCriteria.pageSize);
    });
  }

  changePage(page: number): void {
    this.filterCriteria.page = page;
    const start = (page - 1) * this.filterCriteria.pageSize;
    const end = start + this.filterCriteria.pageSize;

    this.displayedClaims = this.claims.slice(start, end);

    // If the next page has fewer claims than the page size, fetch more from the backend
    if (
      this.displayedClaims.length < this.filterCriteria.pageSize &&
      this.totalClaims > this.claims.length
    ) {
      this.fetchFilteredClaimsFromBackend();
    }
  };

    addClaim(claim: Claim): void {
    this.claims.push(claim);
    this.displayedClaims = this.claims.slice(
      (this.filterCriteria.page - 1) * this.filterCriteria.pageSize,
      this.filterCriteria.page * this.filterCriteria.pageSize
    );
  }
}
