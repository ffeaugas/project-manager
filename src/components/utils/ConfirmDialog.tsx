import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { EntityType } from '../tasks/types';

interface IConfirmDialogProps {
  id: number;
  type: EntityType;
  title: string;
  message: string;
  confirmLabel: string;
  action: (id: number, type: EntityType) => Promise<boolean>;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const ConfirmDialog = ({
  id,
  type,
  title,
  message,
  confirmLabel = 'Delete',
  action,
  onSuccess = () => {},
  children,
}: IConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const success = await action(id, type);

    if (success) {
      setIsOpen(false);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 space-y-2">
        <DialogHeader className="space-y-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
