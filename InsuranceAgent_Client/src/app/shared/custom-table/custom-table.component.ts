import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  ChangeDetectorRef,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Claim } from '../../claims/claim.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tdesignFilter } from '@ng-icons/tdesign-icons';
import { FilterModalComponent } from '../components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgIconComponent],
  viewProviders: [provideIcons({ tdesignFilter })],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
})
export class CustomTableComponent implements OnInit {
  @Input() claims: Claim[] = [];
  @Output() filterFieldSelected = new EventEmitter<string>();
  @Output() createClaim = new EventEmitter<void>();

  filteredClaims: Claim[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchValue: string = '';
  sortField: keyof Claim | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  isFilterModalOpen: boolean = false;
  filterField: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filterClaims();
  }

  filterClaims(): void {
    let claimsToFilter = [...this.claims];
    if (this.sortField) {
      claimsToFilter.sort((a, b) => {
        const aValue = a[this.sortField!];
        const bValue = b[this.sortField!];
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else {
          return 0;
        }
      });
    }
    this.filteredClaims = claimsToFilter.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  toggleSort(field: keyof Claim): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterClaims();
  }

  toggleFilter(field: keyof Claim): void {
    this.filterField = field;
    this.filterFieldSelected.emit(field);
    // console.log(this.isFilterModalOpen);
  }

  openCreateClaimModal(): void {
    this.createClaim.emit();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterClaims();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.claims.length) {
      this.currentPage++;
      this.filterClaims();
    }
  }

  clear(): void {
    this.searchValue = '';
    this.filterClaims();
  }
}
