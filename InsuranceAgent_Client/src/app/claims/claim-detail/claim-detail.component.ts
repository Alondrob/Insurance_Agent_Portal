import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsService } from '../claim.service';
import { Claim } from '../claim.model';

@Component({
  selector: 'app-claim-detail',
  templateUrl: './claim-detail.component.html',
  styleUrls: ['./claim-detail.component.css']
})
export class ClaimDetailComponent implements OnInit {
  claim: Claim | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimService: ClaimsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.claimService.getClaims(id).subscribe((claim) => {
      this.claim = claim;
    });
  }

  goBack(): void {
    this.router.navigate(['/claims']);
  }
}
