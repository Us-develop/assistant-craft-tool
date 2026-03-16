interface PillSelectorProps {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}

export default function PillSelector({ options, selected, onToggle }: PillSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`pill-tag ${selected.includes(opt) ? "active" : ""}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
