interface TableProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableColumnProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface TableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
}

interface TableCellProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Table: React.FC<TableProps> = ({ children, ...props }) => (
  <table className="min-w-full border-collapse" {...props}>
    {children}
  </table>
);

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <thead className="bg-default-50">{children}</thead>
);

export const TableColumn: React.FC<TableColumnProps> = ({
  children,
  style,
  ...props
}) => (
  <th
    className="relative border-r border-divider px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-default-500"
    style={style}
    {...props}
  >
    {children}
  </th>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-divider bg-background">{children}</tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children, ...props }) => (
  <tr className="hover:bg-default-50" {...props}>
    {children}
  </tr>
);

export const TableCell: React.FC<TableCellProps> = ({ children, ...props }) => (
  <td
    className="whitespace-nowrap border-r border-divider px-4 py-2 text-sm text-default-500"
    {...props}
  >
    {children}
  </td>
);
