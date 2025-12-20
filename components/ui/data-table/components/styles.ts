// Tailwind class names for DataTable components
// Note: Nested selectors are handled by applying classes directly to child elements in components

export const dataTableWrapperClasses =
  'overflow-auto flex-1 relative border-t border-l rounded-t-md';

export const tableClasses = 'flex flex-col rounded-t-md';

export const lastLeftPinnedCellWithShadowClasses =
  'relative after:content-[""] after:pointer-events-none after:top-0 after:bottom-0 after:right-0 after:absolute after:w-[30px] after:translate-x-full after:shadow-[rgba(5,5,5,0.06)_10px_0px_8px_-6px_inset]';

export const tableHeadClasses =
  'bg-primary-50 flex sticky top-0 z-[1] font-medium text-neutral-700 items-center';

export const tableHeaderCellClasses = 'h-full p-3 flex justify-between items-center relative';

export const tableHeaderCellPinnedClasses = 'bg-primary-50';

export const tableHeaderCellContentClasses = 'w-full';

export const customColumnHeaderClasses = 'flex items-center justify-between w-full';

export const filterButtonClasses =
  'bg-transparent border-none cursor-pointer pt-1.5 px-1 pb-0 m-0 rounded-lg hover:bg-black/5';

export const resizeTriggerClasses =
  'absolute w-[10px] right-0 top-0 bottom-0 z-[2] cursor-col-resize select-none touch-none after:content-[""] after:h-full after:w-0.5 after:bg-neutral-200 after:inline-block after:absolute after:right-0 hover:after:w-1';

export const resizeGuideLineClasses =
  'z-[2] select-none touch-none absolute right-0 bg-primary w-0.5 h-screen -translate-x-px';

export const tableBodyClasses = 'flex flex-col bg-white';

export const noDataFoundContentClasses =
  'sticky left-1/2 -translate-x-1/2 w-fit flex flex-col items-center justify-center flex-1';

export const tableRowClasses = 'flex flex-row h-full group';

export const tableBodyCellClasses =
  'relative flex items-center p-3 shadow-[0_-2px_0_0_theme(colors.neutral.100)_inset]';

export const tableBodyCellContentClasses = 'w-full';

export const cellFilteredClasses = '!bg-neutral-50';

export const cellSelectedClasses = 'border border-primary';

export const cellSelectionDraggerClasses =
  'h-2.5 w-2.5 bg-primary absolute right-0 bottom-0 cursor-cell';

export const cellBetweenClasses = 'border-r border-l border-dashed border-primary';

export const cellEndClasses = 'border-r border-l border-dashed border-primary';

export const cellEndDownClasses = 'border-b border-dashed border-primary';

export const cellEndUpClasses = 'border-t border-dashed border-primary';

export const cellSelectableClasses = 'cursor-pointer';

export const cellInvalidClasses = 'border-danger';

// For hover effects that need to target child elements, use group utilities in components
export const previewButtonOverlayClasses = 'hidden group-hover:flex';
