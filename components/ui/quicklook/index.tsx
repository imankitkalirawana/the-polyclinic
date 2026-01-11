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
            'grid w-full grid-cols-3 gap-0 divide-x divide-divider p-0 scrollbar-hide',
            classNames?.body
          )}
        >
          <div className="col-span-2 grid h-fit grid-cols-2 divide-x divide-y divide-divider border-b border-divider">
            <div className="col-span-full h-fit p-4">
              <Title level={2} title={title} />
            </div>
            {content}
          </div>
          <div
            className={cn(
              'h-full divide-y divide-divider overflow-y-auto overflow-x-hidden',
              classNames?.sidebar
            )}
          >
            {sidebarContent}
          </div>
        </ModalBody>
        <ModalFooter className={cn('justify-between border-t border-divider', classNames?.footer)}>
          <div className={cn('flex items-center gap-2', classNames?.footerLeft)}>{footerLeft}</div>
          <div className={cn('flex items-center gap-2', classNames?.footerRight)}>
            {footerRight}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
