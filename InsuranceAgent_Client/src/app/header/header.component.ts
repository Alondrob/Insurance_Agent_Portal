import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../shared/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, InputComponent, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchStyles = {
    width: '200px',
    backgroundColor: 'gray',
    borderRadius: '20px',
    cursor: 'pointer',
  };

  constructor(private router:Router){}

  onMouseEnter() {
    this.searchStyles = {
      ...this.searchStyles,
      width: '400px',
      backgroundColor: 'white',
    };
  }

  onMouseLeave() {
    this.searchStyles = {
      ...this.searchStyles,
      width: '200px',
      backgroundColor: 'gray',
    };
  }

  navigateHome() {
    this.router.navigate(['/']);
  }
}
