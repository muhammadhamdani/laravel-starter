import { renderRowAction } from '@/utils/material-table';
import { Link } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    DownloadIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    Loader2,
    RefreshCwIcon,
} from 'lucide-react';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export const DataTableContext = createContext({});

export const UseDataTable = () => useContext(DataTableContext);

export const DataTableProvider = ({
    fetchDataUrl,
    columns,
    formatDataForExport,
    children,
}: {
    fetchDataUrl: string;
    columns: any;
    formatDataForExport: any;
    children: ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        from: 0,
        to: 0,
    });

    const fetchData = async () => {
        if (isLoading) return; // mencegah loop saat sudah loading

        setIsLoading(true);
        try {
            const response = await axios.get(route(fetchDataUrl), {
                params: {
                    page: pagination.page,
                    perPage: pagination.perPage,
                    globalSearch: globalFilter,
                    orderDirection: sorting[0]?.desc ? 'desc' : 'asc',
                    orderBy: sorting[0]?.id ?? 'id',
                },
            });

            setData(response.data.data);
            setPagination({
                ...pagination,
                perPage: response.data.per_page,
                page: response.data.current_page,
                total: response.data.total,
                from: response.data.from,
                to: response.data.to,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.perPage, globalFilter, sorting]);

    const initialColumns = useMemo(
        () =>
            [
                {
                    header: (info: any) => (
                        <Checkbox
                            checked={info.table.getIsAllPageRowsSelected() || (info.table.getIsSomePageRowsSelected() && 'indeterminate')}
                            onCheckedChange={(value) => info.table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                        />
                    ),
                    cell: (info: any) => (
                        <Checkbox
                            checked={info.row.getIsSelected()}
                            onCheckedChange={(value) => info.row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    ),
                    accessorKey: 'select',
                },
                {
                    header: (info: any) => 'No',
                    accessorKey: 'id',
                    cell: (info: any) => (pagination.page - 1) * pagination.perPage + info.row.index + 1,
                },
            ].concat(columns, [
                {
                    header: (info: any) => 'Action',
                    accessorKey: 'actions',
                    cell: (info: any) => renderRowAction(info, fetchData),
                },
            ]),
        [pagination.page, pagination.perPage, globalFilter, sorting],
    );

    const table = useReactTable({
        data,
        columns: initialColumns,
        pageCount: Math.ceil(pagination.total / pagination.perPage),
        state: {
            pagination: {
                pageIndex: pagination.page - 1,
                pageSize: pagination.perPage,
            },
            globalFilter,
            sorting,
        },
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === 'function'
                    ? updater({
                          pageIndex: pagination.page - 1,
                          pageSize: pagination.perPage,
                      })
                    : updater;

            setPagination((prev) => ({
                ...prev,
                page: newState.pageIndex + 1,
                perPage: newState.pageSize,
            }));
        },
    });

    const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

    const handleExport = (type: 'pdf' | 'excel' | 'csv' | 'copy') => {
        if (selectedRows.length === 0) {
            toast.error('Tidak ada data yang dipilih');
            return;
        }

        const dataToExport = formatDataForExport(selectedRows);

        // Lakukan aksi export sesuai tipe
        switch (type) {
            case 'copy':
                const textToCopy = JSON.stringify(dataToExport, null, 2);
                navigator.clipboard.writeText(textToCopy);
                toast.success('Data berhasil disalin');
                break;
            case 'pdf':
                const doc = new jsPDF();
                autoTable(doc, {
                    head: [Object.keys(dataToExport[0])],
                    body: dataToExport.map((obj: any) => Object.values(obj)),
                });
                doc.save('users.pdf');
                break;
            case 'excel':
                const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
                XLSX.writeFile(workbook, 'users.xlsx');
                break;
            case 'csv':
                const csvRows = [
                    Object.keys(dataToExport[0]).join(','), // Header
                    ...dataToExport.map((obj: any) => Object.values(obj).join(',')),
                ];
                const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'users.csv';
                a.click();
                window.URL.revokeObjectURL(url);
                break;
        }
    };

    const contextValue = {
        isLoading,
        columns: initialColumns,
        table,
        pagination,
        setPagination,
        globalFilter,
        setGlobalFilter,
        fetchData,
        handleExport,
    };

    return <DataTableContext.Provider value={contextValue}>{children}</DataTableContext.Provider>;
};

export const DataTableComponent = ({ createRouteUrl, withButton }: { createRouteUrl: string; withButton?: boolean }) => {
    const { columns, table, isLoading }: any = UseDataTable();

    return (
        <section className="flex flex-col space-y-8 p-4 md:space-y-6 md:p-6">
            <div className="flex items-center justify-end">
                <Button asChild>
                    <Link href={route(createRouteUrl)}>
                        <span>Create</span>
                    </Link>
                </Button>
            </div>
            {withButton && <DataTableButton />}
            <div className="flex flex-row items-center justify-between">
                <DataTablePageSize />
                <DataTableGlobalSearch />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: any) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="relative">
                        {isLoading && (
                            <TableRow className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                                <TableCell>
                                    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        )}
                        {table.getRowModel().rows?.length && !isLoading ? (
                            table.getRowModel().rows.map((row: any) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell: any) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length && isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <DataTableInfo />
                <DataTablePagination />
            </div>
        </section>
    );
};

export const DataTableButton = () => {
    const { fetchData, handleExport }: any = UseDataTable();

    return (
        <div className="inline-flex justify-center rounded-md shadow-sm md:justify-start" role="group">
            <Button className="rounded-l-md rounded-r-none" onClick={() => handleExport('copy')}>
                <CopyIcon className="mr-2 h-4 w-4" />
                <span>Copy</span>
            </Button>
            <Button className="rounded-none" onClick={fetchData}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                <span>Reload</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="rounded-l-none rounded-r-md">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        <span>Export</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('excel')}>
                        <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                        Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        CSV
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export const DataTablePageSize = () => {
    const [pageSizeOptions, setPageSizeOptions] = useState([10, 25, 50, 100, 250, 500]);

    const { pagination, setPagination }: any = UseDataTable();

    const handlePageSizeChange = (value: any) => {
        setPagination({
            ...pagination,
            page: 1,
            perPage: parseInt(value),
        });
    };

    return (
        <Select defaultValue={pagination.perPage.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder={pagination.perPage.toString()} />
            </SelectTrigger>
            <SelectContent>
                {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export const DataTableGlobalSearch = () => {
    const { setPagination, globalFilter, setGlobalFilter }: any = UseDataTable();

    const handleGlobalSearchChange = (value: any) => {
        setPagination((prev: any) => ({ ...prev, page: 1 }));
        setGlobalFilter(value);
    };

    return <Input className="w-fit" placeholder="Search" value={globalFilter} onChange={(e) => handleGlobalSearchChange(e.target.value)} />;
};

export const DataTableInfo = () => {
    const { pagination }: any = UseDataTable();

    return (
        <span>
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
        </span>
    );
};

export const DataTablePagination = () => {
    const { pagination, setPagination, isLoading }: any = UseDataTable();

    return (
        <div className="flex flex-row items-center space-x-2">
            <button
                type="button"
                onClick={() => setPagination((prev: any) => ({ ...prev, page: 1 }))}
                disabled={pagination.page === 1 || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronFirstIcon className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() => setPagination((prev: any) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={pagination.page === 1 || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() =>
                    setPagination((prev: any) => ({
                        ...prev,
                        page: Math.min(prev.page + 1, Math.ceil(pagination.total / pagination.perPage)),
                    }))
                }
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage) || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() =>
                    setPagination((prev: any) => ({
                        ...prev,
                        page: Math.ceil(pagination.total / pagination.perPage),
                    }))
                }
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage) || isLoading}
                className="disabled:opacity-50"
            >
                <ChevronLastIcon className="h-6 w-6" />
            </button>
        </div>
    );
};
