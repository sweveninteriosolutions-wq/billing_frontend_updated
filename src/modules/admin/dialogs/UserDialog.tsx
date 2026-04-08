// src/modules/admin/dialogs/UserDialog.tsx
// Mutations handle toasts. Manual state management removed.
// Block close during submission.

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import UserForm from '../forms/UserForm';
import { UserDetail, UserRole } from '@/types/users';
import { useCreateUser, useUpdateUser } from '@/mutations/user.mutations';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'edit';
  user: UserDetail | null;
};

export default function UserDialog({ open, onOpenChange, mode, user }: Props) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sales');

  // Reset form when dialog opens/mode changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && user) {
        setEmail(user.username);
        setRole(user.role);
        setPassword('');
      } else {
        setEmail('');
        setPassword('');
        setRole('sales');
      }
      // Autofocus first input
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [open, mode, user]);

  const isPending = createUser.isPending || updateUser.isPending;

  const handleOpenChange = (v: boolean) => {
    if (!v && isPending) return;
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (mode === 'create' && !password.trim()) {
      toast.error('Password is required for new users');
      return;
    }
    if (mode === 'create') {
      if (password.length < 10) {
        toast.error('Password must be at least 10 characters');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error('Password must contain at least one uppercase letter');
        return;
      }
      if (!/\d/.test(password)) {
        toast.error('Password must contain at least one digit');
        return;
      }
    }

    if (mode === 'create') {
      await createUser.mutateAsync({ email, password, role });
    } else if (user) {
      await updateUser.mutateAsync({
        id: user.id,
        payload: {
          email,
          password: password || undefined,
          role,
          version: user.version,
        },
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create User' : 'Edit User'}
          </DialogTitle>
        </DialogHeader>

        <UserForm
          ref={emailRef}
          email={email}
          password={password}
          role={role}
          mode={mode}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRoleChange={setRole}
        />

        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending
            ? 'Saving…'
            : mode === 'create'
            ? 'Create User'
            : 'Update User'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
