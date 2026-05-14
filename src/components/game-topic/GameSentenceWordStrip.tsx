import { useEffect, useMemo, useRef } from "react";
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

/** Dedupes intro TTS when Strict Mode runs mount effects twice in dev. */
let lastSentenceStripIntroDedupeKey: string | null = null;

type GameSentenceWordStripProps = {
  words: readonly string[];
  wordOrder: number[];
  onWordOrderChange: (next: number[]) => void;
  disabled?: boolean;
  /** When set with the callbacks below, speaks the full sentence on new question and once when solved. */
  sentenceKey?: string;
  isSolved?: boolean;
  onPlaySentence?: () => void;
};

function SortableWordTile({
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

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className={`flex min-h-[3rem] min-w-[2.5rem] cursor-grab touch-manipulation items-center justify-center rounded-2xl border-2 px-3 py-2 text-2xl font-bold font-kids shadow-sm active:cursor-grabbing ${borderClass} ${
        isDragging ? "z-10 opacity-90 shadow-lg" : ""
      } ${disabled ? "cursor-default opacity-60" : ""}`}
      {...attributes}
      {...listeners}
      aria-grabbed={isDragging}
    >
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}

export function GameSentenceWordStrip({
  words,
  wordOrder,
  onWordOrderChange,
  disabled = false,
  sentenceKey,
  isSolved = false,
  onPlaySentence,
}: GameSentenceWordStripProps) {
  const playedSolveForKeyRef = useRef<string | null>(null);

  useEffect(() => {
    playedSolveForKeyRef.current = null;
  }, [sentenceKey]);

  useEffect(() => {
    if (!sentenceKey || !onPlaySentence) return;
    const dedupeKey = `sentence-strip-intro:${sentenceKey}`;
    if (lastSentenceStripIntroDedupeKey === dedupeKey) return;
    lastSentenceStripIntroDedupeKey = dedupeKey;
    onPlaySentence();
  }, [sentenceKey, onPlaySentence]);

  useEffect(() => {
    if (!sentenceKey || !onPlaySentence || !isSolved) return;
    if (playedSolveForKeyRef.current === sentenceKey) return;
    playedSolveForKeyRef.current = sentenceKey;
    onPlaySentence();
  }, [sentenceKey, isSolved, onPlaySentence]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const itemIds = useMemo(() => wordOrder.map(String), [wordOrder]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || disabled) return;
    const a = String(active.id);
    const b = String(over.id);
    if (a === b) return;
    const oldIndex = wordOrder.indexOf(Number(a));
    const newIndex = wordOrder.indexOf(Number(b));
    if (oldIndex < 0 || newIndex < 0) return;
    onWordOrderChange(arrayMove(wordOrder, oldIndex, newIndex));
  };

  if (wordOrder.length === 0) {
    return null;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
        <div
          className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-1"
          role="list"
          aria-label="Words to order"
        >
          {wordOrder.map((wordIdx, slot) => (
            <SortableWordTile
              key={wordIdx}
              id={String(wordIdx)}
              label={words[wordIdx]!}
              isCorrectSlot={words[wordIdx] === words[slot]}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
