'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DiscountType } from '@/types/discount';

type Props = {
  values: {
    name: string;
    code: string;
    discount_type: DiscountType;
    discount_value: string;
    start_date: string;
    end_date: string;
    usage_limit?: string;
    note?: string;
  };
  onChange: (field: string, value: string) => void;
  mode: 'create' | 'edit' | 'view';
  errors?: Record<string, string>;
};

export default function DiscountForm({
  values,
  onChange,
  mode,
  errors = {},
}: Props) {
  const disabled = mode === 'view';

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <p className="text-sm text-destructive mt-1">{errors[name]}</p>
    ) : null;

  return (
    <div className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          disabled={disabled}
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <FieldError name="name" />
      </div>

      <div>
        <Label>Code</Label>
        <Input
          disabled={mode !== 'create'}
          value={values.code}
          onChange={(e) => onChange('code', e.target.value.toUpperCase())}
        />
        <FieldError name="code" />
      </div>

      <div>
        <Label>Discount Type</Label>
        <Select
          disabled={disabled}
          value={values.discount_type}
          onValueChange={(v) => onChange('discount_type', v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="flat">Flat</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="discount_type" />
      </div>

      <div>
        <Label>
          {values.discount_type === 'percentage'
            ? 'Percentage (%)'
            : 'Flat Amount'}
        </Label>
        <Input
          disabled={disabled}
          type="number"
          value={values.discount_value}
          onChange={(e) => onChange('discount_value', e.target.value)}
        />
        <FieldError name="discount_value" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            disabled={disabled}
            type="date"
            value={values.start_date}
            onChange={(e) => onChange('start_date', e.target.value)}
          />
          <FieldError name="start_date" />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            disabled={disabled}
            type="date"
            value={values.end_date}
            onChange={(e) => onChange('end_date', e.target.value)}
          />
          <FieldError name="end_date" />
        </div>
      </div>

      <div>
        <Label>Usage Limit</Label>
        <Input
          disabled={disabled}
          type="number"
          value={values.usage_limit || ''}
          onChange={(e) => onChange('usage_limit', e.target.value)}
        />
        <FieldError name="usage_limit" />
      </div>

      <div>
        <Label>Note</Label>
        <Textarea
          disabled={disabled}
          value={values.note || ''}
          onChange={(e) => onChange('note', e.target.value)}
        />
        <FieldError name="note" />
      </div>
    </div>
  );
}
