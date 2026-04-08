'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { UserRole } from '@/types/users';
import { forwardRef } from 'react';

type Props = {
  email: string;
  password: string;
  role: UserRole;
  mode: 'create' | 'edit';
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (v: UserRole) => void;
};

const UserForm = forwardRef<HTMLInputElement, Props>(
  (
    {
      email,
      password,
      role,
      mode,
      onEmailChange,
      onPasswordChange,
      onRoleChange,
    },
    ref
  ) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="user-email">Email Address *</Label>
        <Input
          ref={ref}
          id="user-email"
          type="email"
          placeholder="e.g. user@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="user-password">
          {mode === 'edit' ? 'Password (leave blank to keep unchanged)' : 'Password *'}
        </Label>
        <Input
          id="user-password"
          type="password"
          placeholder={mode === 'edit' ? 'Leave blank to keep unchanged' : 'Min 10 chars, 1 uppercase, 1 digit'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        {mode === 'create' && (
          <p className="text-xs text-muted-foreground mt-1">
            Minimum 10 characters, must include at least one uppercase letter and one digit.
          </p>
        )}
      </div>

      <div>
        <Label>Role</Label>
        <Select value={role} onValueChange={(v) => onRoleChange(v as UserRole)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

UserForm.displayName = 'UserForm';

export default UserForm;
