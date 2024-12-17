import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,  
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Column<T> {
  header: string;
  cell?: (item: T) => React.ReactNode;
  accessorKey?: keyof T;
  className?: string;
}

interface DataTableProps<T> { 
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  rowKeyField?: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  footer?: React.ReactNode;
}

export const DataTable = <T extends object>(
  {
    data,
    columns,
    onRowClick,
    rowKeyField,
      isLoading = false,
  emptyMessage = "No data available",
    footer = null
  }: DataTableProps<T>
) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center h-24">
              Loading...
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center h-24">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow
              key={String(rowKeyField ?item[rowKeyField]: undefined)}
              className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, index) => (
                <TableCell key={index} className={column.className}>
                  {column.cell
                    ? column.cell(item)
                    : column.accessorKey
                    ? String(item[column.accessorKey])
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}


