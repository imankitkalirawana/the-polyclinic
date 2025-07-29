'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';

type ModalOptions = {
  body: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  props?: Partial<React.ComponentProps<typeof Modal>>;
};

type ModalContextValue = {
  show: (options: ModalOptions) => void;
  hide: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ModalOptions>({ body: null });

  const show = (options: ModalOptions) => {
    setOpts(options);
    setOpen(true);
  };
  const hide = () => setOpen(false);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      <Modal
        isOpen={open}
        backdrop="blur"
        scrollBehavior="inside"
        onOpenChange={(o) => !o && hide()}
        {...opts.props}
      >
        <ModalContent>
          {() => (
            <>
              {opts.header && <ModalHeader>{opts.header}</ModalHeader>}
              <ModalBody>{opts.body}</ModalBody>
              {opts.footer && <ModalFooter>{opts.footer}</ModalFooter>}
            </>
          )}
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
};
