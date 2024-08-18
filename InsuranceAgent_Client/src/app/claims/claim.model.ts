export interface Claim {
  date: string | number | Date;
  id: number;
  policyNumber: string;
  dateofLoss: Date;
  causeOfLoss: string;
  claimAmount: number;
  status: string;
  claimType: string;
  customerName: string;
}