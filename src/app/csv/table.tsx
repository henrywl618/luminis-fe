import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Encounter } from "./types";

export default function Table(props: { csvData: Encounter[] }) {
    const { csvData } = props;
    const columnHelper = createColumnHelper<Encounter>();
    const columns = useMemo(
        () => [
            columnHelper.accessor("PatientIdentifier", {
                cell: (info) => info.getValue(),
                header: () => <b>Patient ID</b>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("Facility", {
                cell: (info) => info.getValue(),
                header: () => <b>Facility</b>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("PatientComplaint", {
                cell: (info) => info.getValue(),
                header: () => <b>Complaint</b>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("EncounterClass", {
                cell: (info) => info.getValue(),
                header: () => <b>Encounter Class</b>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("EncounterBeginTime", {
                cell: (info) => info.getValue(),
                header: () => <b>Begin Time</b>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("EncounterEndTime", {
                cell: (info) => info.getValue(),
                header: () => <b>End Time</b>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("Length of Stay (hrs)", {
                cell: (info) => info.getValue(),
                header: () => <b>Duration(hrs)</b>,
                footer: (info) => info.column.id,
            }),
        ],
        []
    );
    const table = useReactTable({
        data: csvData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <table className="border-separate border-spacing-0.5 border border-slate-500">
                <thead className="">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="bg-gray-200">
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="px-2">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="even:bg-gray-200 odd:bg-white">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-2">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getRowModel().rows.length} Rows</div>
        </>
    );
}
