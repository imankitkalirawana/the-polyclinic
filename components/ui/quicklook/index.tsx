import { Title } from '@/components/ui/typography/modal';
import { cn, Modal, ModalBody, ModalContent, ModalFooter, ScrollShadow } from '@heroui/react';

type QuickLookProps = {
  title?: string;
  content?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  classNames?: {
    content?: string;
    sidebar?: string;
    body?: string;
    footer?: string;
    footerLeft?: string;
    footerRight?: string;
  };
  onClose?: () => void;
};

export default function QuickLook({
  title = 'Details',
  content,
  sidebarContent,
  footerLeft,
  footerRight,
  classNames,
  onClose,
}: QuickLookProps) {
  return (
    <Modal size="5xl" isOpen backdrop="blur" scrollBehavior="inside" onClose={onClose}>
      <ModalContent className="h-[80vh] overflow-hidden">
        <ModalBody
          as={ScrollShadow}
          className={cn(
            'divide-divider scrollbar-hide grid w-full grid-cols-3 gap-0 divide-x p-0',
            classNames?.body
          )}
        >
          <div className="divide-divider border-divider col-span-2 grid h-fit grid-cols-2 divide-x divide-y border-b">
            <div className="col-span-full h-fit p-4">
              <Title level={2} title={title} />
            </div>
            {content}
          </div>
          <div
            className={cn(
              'divide-divider h-full divide-y overflow-x-hidden overflow-y-auto',
              classNames?.sidebar
            )}
          >
            {sidebarContent}
          </div>
        </ModalBody>
        <ModalFooter className={cn('border-divider justify-between border-t', classNames?.footer)}>
          <div className={cn('flex items-center gap-2', classNames?.footerLeft)}>{footerLeft}</div>
          <div className={cn('flex items-center gap-2', classNames?.footerRight)}>
            {footerRight}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
