import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type GameSpellLetterStripProps = {
  graphemes: readonly string[];
  letterOrder: number[];
  onLetterOrderChange: (next: number[]) => void;
  disabled?: boolean;
};

function SortableLetterTile({
  id,
  label,
  isCorrectSlot,
  disabled,
}: {
  id: string;
  label: string;
  isCorrectSlot: boolean;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const borderClass = isCorrectSlot
    ? "border-green-500 bg-green-50 text-green-900"
    : "border-red-400 bg-red-50 text-red-900";

  const display = label === " " ? "\u00a0" : label;

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={`flex min-h-[3rem] min-w-[2.75rem] cursor-grab touch-manipulation items-center justify-center rounded-xl border-2 px-3 py-2 text-xl font-bold shadow-sm active:cursor-grabbing ${borderClass} ${
        isDragging ? "z-10 opacity-90 shadow-lg" : ""
      } ${disabled ? "cursor-default opacity-60" : ""}`}
      {...attributes}
      {...listeners}
      aria-grabbed={isDragging}
    >
      <span className={label === " " ? "inline-block min-w-[0.35em]" : ""}>{display}</span>
    </button>
  );
}

export function GameSpellLetterStrip({
  graphemes,
  letterOrder,
  onLetterOrderChange,
  disabled = false,
}: GameSpellLetterStripProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const itemIds = useMemo(() => letterOrder.map(String), [letterOrder]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || disabled) return;
    const a = String(active.id);
    const b = String(over.id);
    if (a === b) return;
    const oldIndex = letterOrder.indexOf(Number(a));
    const newIndex = letterOrder.indexOf(Number(b));
    if (oldIndex < 0 || newIndex < 0) return;
    onLetterOrderChange(arrayMove(letterOrder, oldIndex, newIndex));
  };

  if (letterOrder.length === 0) {
    return null;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1" role="list" aria-label="Letters to order">
          {letterOrder.map((gramIdx, slot) => (
            <SortableLetterTile
              key={gramIdx}
              id={String(gramIdx)}
              label={graphemes[gramIdx]!}
              isCorrectSlot={graphemes[gramIdx] === graphemes[slot]}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
