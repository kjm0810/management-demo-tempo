"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClassName?: string;
};

export default function Modal({ title, onClose, children, widthClassName = "max-w-sm" }: ModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${widthClassName} sm:${widthClassName}`}>
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
