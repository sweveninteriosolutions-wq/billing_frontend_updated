'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import UserForm from '../forms/UserForm';
import { UserDetail, UserRole } from '@/types/users';
import {
  useCreateUser,
  useUpdateUser,
} from '@/mutations/user.mutations';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'edit';
  user: UserDetail | null;
};

export default function UserDialog({
  open,
  onOpenChange,
  mode,
  user,
}: Props) {
  const { toast } = useToast();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sales');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setEmail(user.username);
      setRole(user.role);
      setPassword('');
    } else {
      setEmail('');
      setPassword('');
      setRole('sales');
    }
  }, [mode, user]);

  const handleSubmit = async () => {
    // 🔒 Basic validation (don’t be lazy)
    if (!email.trim()) {
      toast({ title: 'Email is required', variant: 'destructive' });
      return;
    }

    if (mode === 'create' && !password.trim()) {
      toast({ title: 'Password is required', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);

      if (mode === 'create') {
        await createUser.mutateAsync({
          email,
          password,
          role,
        });

        toast({ title: 'User created successfully' });
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

        toast({ title: 'User updated successfully' });
      }

      onOpenChange(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Create User' : 'Edit User'}
          </h2>
        </DialogHeader>

        <UserForm
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
          disabled={submitting}
        >
          {submitting
            ? 'Saving...'
            : mode === 'create'
            ? 'Create User'
            : 'Update User'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
