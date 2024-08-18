import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.css']
})
export class BaseModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() modalStyles: { [key: string]: string } = {};
  @Output() closeModal = new EventEmitter<void>();


   ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      this.isOpen = changes['isOpen'].currentValue;
            console.log('BaseModalComponent - isOpen changed:', this.isOpen);  // Log isOpen changes

    }
  }



  close() {
    this.isOpen = false;
    this.closeModal.emit();
    console.log("modal closed")
  }
}
