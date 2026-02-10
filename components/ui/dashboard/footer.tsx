'use client';

import React from 'react';
import { cn } from '@heroui/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DashboardFooterProps {
  /** The content to render inside the footer */
  children: React.ReactNode;
  /** Additional className for the footer container */
  className?: string;
  /** Custom styles for different parts of the footer */
  classNames?: {
    /** Styles for the outer wrapper (includes padding/positioning) */
    wrapper?: string;
    /** Styles for the inner content container */
    content?: string;
  };
  /** Whether to show a top border */
  showBorder?: boolean;
  /** Whether to apply blur/glass effect to the footer background */
  blurred?: boolean;
  /** Alignment of the footer content */
  align?: 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
}

const alignmentClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

/**
 * A reusable dashboard footer component that renders at the fixed bottom position.
 * Can be used in any dashboard page by wrapping content with this component.
 *
 * @example
 * ```tsx
 * <DashboardFooter>
 *   <Button>Cancel</Button>
 *   <Button color="primary">Save</Button>
 * </DashboardFooter>
 * ```
 *
 * @example With container wrapper
 * ```tsx
 * <DashboardContentWithFooter
 *   footer={
 *     <DashboardFooter>
 *       <Button>Submit</Button>
 *     </DashboardFooter>
 *   }
 * >
 *   {pageContent}
 * </DashboardContentWithFooter>
 * ```
 */
export function DashboardFooter({
  children,
  className,
  classNames,
  showBorder = true,
  blurred = false,
  align = 'right',
}: DashboardFooterProps) {
  const [isHidden] = useLocalStorage('isDashboardSidebarHidden', true);

  return (
    <div
      className={cn(
        'duration-250 fixed inset-x-0 bottom-0 z-50 ml-auto w-[calc(100%-288px)] shrink-0 transition-all ease-in-out',
        {
          'w-[calc(100%-64px)]': isHidden,
          'border-divider border-t': showBorder,
          'bg-background/80 backdrop-blur-lg backdrop-saturate-150': blurred,
          'bg-background': !blurred,
        },
        classNames?.wrapper,
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3',
          alignmentClasses[align],
          classNames?.content
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface DashboardContentWithFooterProps {
  /** Main content of the page */
  children: React.ReactNode;
  /** Footer content - pass DashboardFooter here or custom footer */
  footer?: React.ReactNode;
  /** Additional className for the main content area */
  className?: string;
  /** ClassNames for different sections */
  classNames?: {
    /** Styles for the content wrapper */
    content?: string;
    /** Styles for the footer area */
    footer?: string;
  };
}

/**
 * A wrapper component that provides proper layout for dashboard pages with a fixed footer.
 * It ensures the content area has proper padding at the bottom to account for the fixed footer.
 *
 * @example
 * ```tsx
 * <DashboardContentWithFooter
 *   footer={
 *     <DashboardFooter>
 *       <Button>Cancel</Button>
 *       <Button color="primary">Save</Button>
 *     </DashboardFooter>
 *   }
 * >
 *   <h1>Page Content</h1>
 *   <form>...</form>
 * </DashboardContentWithFooter>
 * ```
 */
export function DashboardContentWithFooter({
  children,
  footer,
  className,
  classNames,
}: DashboardContentWithFooterProps) {
  return (
    <div className={cn('relative flex h-full flex-col', className)}>
      {/* Main content with bottom padding to account for fixed footer */}
      <div
        className={cn(
          'flex-1 overflow-auto',
          {
            'pb-16': footer,
          },
          classNames?.content
        )}
      >
        {children}
      </div>

      {/* Footer area */}
      {footer && <div className={cn(classNames?.footer)}>{footer}</div>}
    </div>
  );
}

interface InlineFooterProps {
  /** The content to render inside the footer */
  children: React.ReactNode;
  /** Additional className for the footer container */
  className?: string;
  /** Whether to show a top border */
  showBorder?: boolean;
  /** Alignment of the footer content */
  align?: 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
}

/**
 * An inline (non-fixed) footer variant that stays at the bottom of its container.
 * Use this when you need a footer inside a scrollable area or card.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardBody>
 *     {content}
 *   </CardBody>
 *   <InlineFooter>
 *     <Button>Submit</Button>
 *   </InlineFooter>
 * </Card>
 * ```
 */
export function InlineFooter({
  children,
  className,
  showBorder = true,
  align = 'right',
}: InlineFooterProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-3 px-4 py-3',
        showBorder && 'border-divider border-t',
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

export default DashboardFooter;
