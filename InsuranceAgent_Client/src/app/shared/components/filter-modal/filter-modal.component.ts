import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModalComponent } from '../base-modal/base-modal.component';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../sidebar/sidebar.component';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, BaseModalComponent, FormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css'],
})
export class FilterModalComponent {
  @Input() isOpen: boolean = false;
  @Input() filterField: string = '';
  @Output() closeModal = new EventEmitter<void>();

  filterConfig: any = {};
  filterValues: any = {};

  modalStyles: { [key: string]: string } = {
    width: '350px',
    height: '200px',
  }; // Custom styles for the modal

  ngOnInit(): void {
    this.initializeFilterConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterField']) {
      this.initializeFilterConfig();
    }
  }

  initializeFilterConfig() {
    this.filterConfig = {
      id: [
        { label: 'Claim ID', type: 'text', key: 'claimId' },
        { label: 'From Claim ID', type: 'text', key: 'fromClaimId' },
        { label: 'To Claim ID', type: 'text', key: 'toClaimId' },
      ],
      policyNumber: [
        { label: 'Policy Number', type: 'text', key: 'policyNumber' },
      ],
      causeOfLoss: [
        { label: 'Cause of Loss', type: 'text', key: 'causeOfLoss' },
      ],
      customerName: [
        { label: 'Customer Name', type: 'text', key: 'customerName' },
      ],
      dateofLoss: [
        { label: 'From Date of Loss', type: 'date', key: 'fromDateofLoss' },
        { label: 'To Date of Loss', type: 'date', key: 'toDateofLoss' },
      ],
      claimAmount: [
        { label: 'Claim Amount', type: 'number', key: 'claimAmount' },
        { label: 'From Claim Amount', type: 'number', key: 'fromClaimAmount' },
        { label: 'To Claim Amount', type: 'number', key: 'toClaimAmount' },
      ],
      status: [{ label: 'Status', type: 'text', key: 'status' }],
    };

    // Initialize filter values
    if (this.filterConfig[this.filterField]) {
      this.filterConfig[this.filterField].forEach((field: any) => {
        this.filterValues[field.key] = '';
      });
    } else {
      console.error(`Invalid filterField: ${this.filterField}`);
      this.filterValues = {};
    }
  }

  close() {
    this.isOpen = false;
    this.closeModal.emit();
  }

  applyFilters() {
    console.log(`Applying filter for ${this.filterField}:`, this.filterValues);
    this.close();
  }
}
