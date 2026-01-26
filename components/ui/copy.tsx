import React, { forwardRef, memo, useMemo } from 'react';
import { Button, cn, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  textClassName?: string;
  copyText?: string;
  children: string | null | undefined;
}

export const CopyText = memo(
  forwardRef<HTMLDivElement, CopyTextProps>((props, forwardedRef) => {
    const { className, textClassName, children, copyText = 'Copy' } = props;
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState<ReturnType<typeof setTimeout> | null>(
      null
    );
    const onClearTimeout = () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };

    const handleClick = async () => {
      onClearTimeout();

      const textToCopy = children || '';

      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);

        setCopyTimeout(
          setTimeout(() => {
            setCopied(false);
          }, 3000)
        );
      } catch (error) {
        console.error('Failed to copy text:', error);
        // Fallback for older browsers or when clipboard API is not available
        try {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);

          setCopied(true);
          setCopyTimeout(
            setTimeout(() => {
              setCopied(false);
            }, 3000)
          );
        } catch (fallbackError) {
          console.error('Fallback copy method also failed:', fallbackError);
        }
      }
    };

    const content = useMemo(() => (copied ? 'Copied' : copyText), [copied, copyText]);

    const isEmpty = !children || children === '-';

    return (
      <div
        ref={forwardedRef}
        className={cn('group flex items-center gap-1 text-default-500', className)}
      >
        <span className={textClassName}>{children || '-'}</span>
        <Tooltip delay={1000} className="text-foreground" content={content} isDisabled={isEmpty}>
          <Button
            isIconOnly
            isDisabled={isEmpty}
            className={cn('h-7 w-7 min-w-7 text-default-400 opacity-0 group-hover:opacity-100', {
              'group-hover:opacity-0': isEmpty,
            })}
            size="sm"
            variant="light"
            color={copied ? 'success' : 'default'}
            onPress={handleClick}
          >
            <Icon icon={copied ? 'solar:check-read-linear' : 'solar:copy-linear'} width={15} />
          </Button>
        </Tooltip>
      </div>
    );
  })
);

CopyText.displayName = 'CopyText';
