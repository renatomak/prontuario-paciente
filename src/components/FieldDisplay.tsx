interface FieldDisplayProps {
  label: string;
  value: React.ReactNode;
  labelClassName?: string;
}

export function FieldDisplay({ label, value, labelClassName = "text-xs" }: FieldDisplayProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`${labelClassName} uppercase tracking-wide text-muted-foreground`}>{label}</span>
      <span className="text-sm font-medium text-foreground min-h-5 border-b border-border/60 pb-1">
        {value || "\u2014"}
      </span>
    </div>
  );
}
