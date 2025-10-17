export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="text-neutral-500 dark:text-neutral-400">{children}</thead>
  );
}

export function TBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {children}
    </tbody>
  );
}

export function TR({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
      {children}
    </tr>
  );
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 font-medium">{children}</th>;
}

export function TD({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2">{children}</td>;
}

export default Table;
