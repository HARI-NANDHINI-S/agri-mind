import React from "react";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
}

function Table<T>({ columns, data, emptyMessage = "No data available", loading }: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full flex flex-col gap-3 py-6">
        <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-neutral-50 rounded-lg animate-pulse" />
        <div className="h-12 bg-neutral-50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 border border-dashed border-neutral-200 rounded-xl flex items-center justify-center text-sm text-neutral-500 font-medium bg-neutral-50/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-700 tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-neutral-50/50 transition-colors duration-150">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 font-medium">
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
