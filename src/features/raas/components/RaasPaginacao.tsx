import Button from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export interface RaasPaginacaoProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function RaasPaginacao({
  page,
  totalPages,
  pageSize,
  totalElements,
  loading,
  onPageChange,
  onPageSizeChange,
}: RaasPaginacaoProps) {
  const isFirst = page === 0;
  const isLast = page >= totalPages - 1;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <NavButton
        icon={ChevronsLeft}
        title="Primeira página"
        onClick={() => onPageChange(0)}
        disabled={loading || isFirst}
      />
      <NavButton
        icon={ChevronLeft}
        title="Página anterior"
        onClick={() => onPageChange(page - 1)}
        disabled={loading || isFirst}
      />

      <span className="px-2 tabular-nums">
        {page + 1} / {totalPages}
      </span>

      <NavButton
        icon={ChevronRight}
        title="Próxima página"
        onClick={() => onPageChange(page + 1)}
        disabled={loading || isLast}
      />
      <NavButton
        icon={ChevronsRight}
        title="Última página"
        onClick={() => onPageChange(totalPages - 1)}
        disabled={loading || isLast}
      />

      <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />

      <span className="text-muted-foreground ml-2">
        Total de itens: {totalElements.toLocaleString("pt-BR")}
      </span>
    </div>
  );
}

interface NavButtonProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
  disabled: boolean;
}

function NavButton({ icon: Icon, title, onClick, disabled }: NavButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

function PageSizeSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (size: number) => void;
}) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="h-8 w-[80px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZE_OPTIONS.map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}