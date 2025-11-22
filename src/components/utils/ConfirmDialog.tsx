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

interface IConfirmDialogProps {
  id: string;
  route: string;
  title: string;
  message: string;
  confirmLabel: string;
  action: (id: string, route: string) => Promise<boolean> | Promise<void>;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const ConfirmDialog = ({
  id,
  route,
  title,
  message,
  confirmLabel = 'Delete',
  action,
  onSuccess = () => {},
  children,
}: IConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    const success = await action(id, route);

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
      <DialogContent className="sm:max-w-[425px] bg-background2 space-y-2">
        <DialogHeader className="space-y-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
