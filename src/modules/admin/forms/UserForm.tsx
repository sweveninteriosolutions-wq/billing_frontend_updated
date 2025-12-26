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

type Props = {
  email: string;
  password: string;
  role: UserRole;
  mode: 'create' | 'edit';
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (v: UserRole) => void;
};

export default function UserForm({
  email,
  password,
  role,
  mode,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input value={email} onChange={(e) => onEmailChange(e.target.value)} />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder={mode === 'edit' ? 'Leave blank to keep unchanged' : ''}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
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
            <SelectItem value="cashier">cashier</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
