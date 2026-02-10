'use client';

import { cn } from '@heroui/react';

interface DataTableProps {
  data: Record<string, string>;
}

export default function DataTable({ data }: DataTableProps) {
  const numRows = Math.max(...Object.keys(data).map((key) => parseInt(key.split('-')[1]))) + 1;

  const numCols = Math.max(...Object.keys(data).map((key) => parseInt(key.split('-')[2]))) + 1;

  return (
    <div className="flex min-h-24 min-w-[18rem] flex-wrap items-center justify-center gap-2 overflow-x-hidden bg-cover bg-top">
      <div className="overflow-x-auto md:w-full">
        <table className="table w-full table-auto border-collapse">
          <thead />
          <tbody className="divide-default-200 divide-y">
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {Array.from({ length: numCols }).map((_, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn('bg-default-100 px-4 py-2 whitespace-nowrap', {
                      'rounded-tl-xl': rowIndex === 0 && colIndex === 0,
                      'rounded-tr-xl': rowIndex === 0 && colIndex === numCols - 1,
                      'rounded-bl-xl': rowIndex === numRows - 1 && colIndex === 0,
                      'rounded-br-xl': rowIndex === numRows - 1 && colIndex === numCols - 1,
                    })}
                  >
                    {data[`cell-${rowIndex}-${colIndex}`] ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data[`cell-${rowIndex}-${colIndex}`],
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
