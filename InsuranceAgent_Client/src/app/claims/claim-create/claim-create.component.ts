import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-claim-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claim-create.component.html',
  styleUrls: ['./claim-create.component.css']
})
export class ClaimCreateComponent {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitClaim = new EventEmitter<any>();

  claimData: any = {
    id: '',
    policyNumber: '',
    dateofLoss: '',
    causeOfLoss: '',
    claimAmount: '',
    status: '',
    claimType: '',
    customerName: ''
  };

  close(): void {
    this.closeModal.emit();
  }

  submit(): void {
    this.submitClaim.emit(this.claimData);
    this.close();
  }
}
