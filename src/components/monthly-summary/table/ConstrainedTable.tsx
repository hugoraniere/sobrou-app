
import React from 'react';
import { cn } from '@/lib/utils';

interface ConstrainedTableProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface ConstrainedTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ConstrainedTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ConstrainedTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

interface ConstrainedTableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  onClick?: () => void;
}

interface ConstrainedTableHeadProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ConstrainedTable: React.FC<ConstrainedTableProps> = ({ 
  children, 
  className, 
  style 
}) => {
  return (
    <table 
      className={cn("w-full border-collapse table-fixed", className)}
      style={style}
    >
      {children}
    </table>
  );
};

export const ConstrainedTableHeader: React.FC<ConstrainedTableHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <thead className={cn("", className)}>
      {children}
    </thead>
  );
};

export const ConstrainedTableBody: React.FC<ConstrainedTableBodyProps> = ({ 
  children, 
  className 
}) => {
  return (
    <tbody className={cn("", className)}>
      {children}
    </tbody>
  );
};

export const ConstrainedTableRow: React.FC<ConstrainedTableRowProps> = ({ 
  children, 
  className,
  onClick,
  draggable,
  onDragOver,
  onDrop
}) => {
  return (
    <tr 
      className={cn("border-b border-gray-200", className)}
      onClick={onClick}
      draggable={draggable}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </tr>
  );
};

export const ConstrainedTableCell: React.FC<ConstrainedTableCellProps> = ({ 
  children, 
  className,
  colSpan,
  onClick
}) => {
  return (
    <td 
      className={cn("px-1 py-2 text-xs border-r border-gray-100", className)}
      colSpan={colSpan}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

export const ConstrainedTableHead: React.FC<ConstrainedTableHeadProps> = ({ 
  children, 
  className,
  onClick
}) => {
  return (
    <th 
      className={cn("px-1 py-2 text-xs font-medium text-left border-r border-gray-200 bg-gray-50", className)}
      onClick={onClick}
    >
      {children}
    </th>
  );
};
