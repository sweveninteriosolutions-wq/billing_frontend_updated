// src/components/table/TableBodySkeleton.tsx
interface TableBodySkeletonProps {
  rows?: number;
  columns: number;
}

export const TableBodySkeleton = ({
  rows = 10,
  columns,
}: TableBodySkeletonProps) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
