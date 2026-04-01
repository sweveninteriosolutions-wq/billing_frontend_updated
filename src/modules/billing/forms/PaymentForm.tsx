'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddPayment } from '@/mutations/invoice.mutations';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';
import { InvoiceOut } from '@/types/invoice';

const PAYMENT_METHODS = ['cash', 'card', 'upi', 'bank_transfer', 'cheque'];

type Props = {
  invoice: InvoiceOut;
  onSuccess: () => void;
};

export default function PaymentForm({ invoice, onSuccess }: Props) {
  const handleError = useGlobalError();
  const addPayment = useAddPayment();

  const balanceDue = Number(invoice.balance_due);

  const [amount, setAmount] = useState<number>(balanceDue);
  const [method, setMethod] = useState('cash');

  const handleSubmit = async () => {
    if (amount <= 0) {
      handleError(new AppError('Payment amount must be positive', 'VALIDATION_ERROR', 400));
      return;
    }
    if (amount > balanceDue) {
      handleError(new AppError('Amount exceeds balance due', 'VALIDATION_ERROR', 400));
      return;
    }

    try {
      await addPayment.mutateAsync({
        invoiceId: invoice.id,
        payload: { amount, payment_method: method },
      });
      onSuccess();
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Invoice</span>
          <span className="font-mono font-medium">{invoice.invoice_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Net Total</span>
          <span>₹{Number(invoice.net_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Paid</span>
          <span className="text-green-600">
            ₹{Number(invoice.total_paid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-1">
          <span>Balance Due</span>
          <span className="text-orange-600">
            ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div>
        <Label className="mb-1 block">Payment Amount (₹) *</Label>
        <Input
          type="number"
          min={0.01}
          max={balanceDue}
          step={0.01}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </div>

      {/* Method */}
      <div>
        <Label className="mb-1 block">Payment Method *</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map(m => (
              <SelectItem key={m} value={m} className="capitalize">
                {m.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit} disabled={addPayment.isPending} className="min-w-[130px]">
          {addPayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Record Payment
        </Button>
      </div>
    </div>
  );
}
