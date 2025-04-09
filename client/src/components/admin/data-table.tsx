import * as React from "react";
import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, X, Settings, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  showColumnToggle?: boolean;
  isLoading?: boolean;
  loadingRowCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  showColumnToggle = true,
  isLoading = false,
  loadingRowCount = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Update rows per page
  useEffect(() => {
    table.setPageSize(rowsPerPage);
  }, [rowsPerPage, table]);

  // Handle search when searchKey is provided
  useEffect(() => {
    if (searchKey && searchValue) {
      table.getColumn(searchKey)?.setFilterValue(searchValue);
    }
  }, [searchValue, searchKey, table]);

  // Clear search
  const handleClearSearch = () => {
    setSearchValue("");
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue("");
    }
  };

  // Generate loading skeleton rows
  const LoadingRows = React.memo(() => (
    <>
      {Array(loadingRowCount).fill(0).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {columns.map((column, colIndex) => (
            <TableCell key={`skeleton-cell-${colIndex}`}>
              <div className="h-5 bg-neutral-200 rounded animate-pulse w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  ));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {searchKey && (
          <div className="flex items-center w-full sm:w-auto sm:min-w-[300px]">
            <div className="relative w-full">
              <Input
                placeholder={`Search...`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-9"
              />
              <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full aspect-square rounded-l-none"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4 text-neutral-400" />
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-row gap-2 ml-auto">
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace(/([A-Z])/g, " $1").trim()}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex-1 text-sm text-neutral-500">
          Showing{" "}
          <strong>
            {table.getRowModel().rows.length > 0
              ? table.getState().pagination.pageIndex * rowsPerPage + 1
              : 0}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * rowsPerPage,
              table.getFilteredRowModel().rows.length
            )}
          </strong>{" "}
          of <strong>{table.getFilteredRowModel().rows.length}</strong> results
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(val) => setRowsPerPage(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <span className="text-xs">1</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <div className="flex items-center gap-1 text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <span className="text-xs">{table.getPageCount()}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
