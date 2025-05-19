export type DurationType = 'fixed' | '1' | '3' | '6';

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  duration: DurationType;
  startDate: string;
}
