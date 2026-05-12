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

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

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
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(0)}
        disabled={loading || page === 0}
        title="Primeira página"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={loading || page === 0}
        title="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="px-2 tabular-nums">
        {page + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={loading || page >= totalPages - 1}
        title="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(totalPages - 1)}
        disabled={loading || page >= totalPages - 1}
        title="Última página"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
      <Select
        value={String(pageSize)}
        onValueChange={(v) => onPageSizeChange(Number(v))}
      >
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
      <span className="text-muted-foreground ml-2">
        Total de itens: {totalElements.toLocaleString("pt-BR")}
      </span>
    </div>
  );
}
