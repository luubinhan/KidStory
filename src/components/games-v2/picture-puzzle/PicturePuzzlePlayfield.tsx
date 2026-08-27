import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DragSource, DragTarget, PicturePuzzleBoard } from "../../../lib/picturePuzzle";
import { cn } from "../../../lib/utils";
import { PicturePuzzleTile } from "./PicturePuzzleTile";

type PicturePuzzlePlayfieldProps = {
  imageSrc: string;
  board: PicturePuzzleBoard;
  tray: readonly number[];
  disabled?: boolean;
  onDrag: (source: DragSource, target: DragTarget) => void;
};

function parseTileId(id: string): number | null {
  const match = /^tile-(\d+)$/.exec(id);
  if (!match) return null;
  return Number(match[1]);
}

function parseTarget(id: string): DragTarget | null {
  if (id === "tray") return { kind: "tray" };
  const match = /^slot-(\d+)$/.exec(id);
  if (!match) return null;
  return { kind: "slot", index: Number(match[1]) };
}

function locateSource(tileId: number, board: PicturePuzzleBoard): DragSource {
  const slot = board.findIndex((id) => id === tileId);
  if (slot >= 0) return { kind: "slot", index: slot };
  return { kind: "tray", tileId };
}

function DraggableTile({
  tileId,
  imageSrc,
  disabled,
}: {
  tileId: number;
  imageSrc: string;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tile-${tileId}`,
    disabled,
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      className={cn(
        "relative size-full cursor-grab touch-manipulation overflow-hidden rounded-lg border-2 border-white shadow-sm active:cursor-grabbing",
        isDragging && "z-10 opacity-90 shadow-lg",
        disabled && "cursor-default opacity-80",
      )}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      aria-label={`Puzzle piece ${tileId + 1}`}
    >
      <PicturePuzzleTile tileId={tileId} imageSrc={imageSrc} />
    </button>
  );
}

function Slot({
  index,
  tileId,
  imageSrc,
  disabled,
}: {
  index: number;
  tileId: number | null;
  imageSrc: string;
  disabled: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "aspect-square rounded-md border-2 border-dashed border-slate-300 bg-white/70",
        isOver && "border-yellow-400 bg-yellow-50",
      )}
    >
      {tileId !== null ? (
        <DraggableTile tileId={tileId} imageSrc={imageSrc} disabled={disabled} />
      ) : null}
    </div>
  );
}

function PlayfieldBody({
  imageSrc,
  board,
  tray,
  disabled,
}: {
  imageSrc: string;
  board: PicturePuzzleBoard;
  tray: readonly number[];
  disabled: boolean;
}) {
  const { setNodeRef: setTrayRef, isOver: trayOver } = useDroppable({ id: "tray" });

  return (
    <div>
      <div
        ref={setTrayRef}
        className={cn(
          "flex absolute left-0 top-0 bottom-[70px] w-[120px] gap-1 flex-wrap justify-center items-start rounded-md border-2 border-dashed border-slate-200 bg-white/60 p-3",
          trayOver && "border-yellow-400 bg-yellow-50",
        )}
      >
        {tray.map((tileId) => (
          <div key={`tray-${tileId}`} className="size-18">
            <DraggableTile tileId={tileId} imageSrc={imageSrc} disabled={disabled} />
          </div>
        ))}
      </div>
      <div className="grid max-w-xl mx-auto  grid-cols-3">
        {board.map((tileId, index) => (
          <Slot
            key={`slot-${index}`}
            index={index}
            tileId={tileId}
            imageSrc={imageSrc}
            disabled={disabled}
          />
        ))}
      </div>
      
    </div>
  );
}

export function PicturePuzzlePlayfield({
  imageSrc,
  board,
  tray,
  disabled = false,
  onDrag,
}: PicturePuzzlePlayfieldProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return;
    const overId = event.over?.id;
    if (overId == null) return;
    const tileId = parseTileId(String(event.active.id));
    const target = parseTarget(String(overId));
    if (tileId === null || !target) return;
    if (target.kind === "slot" && board[target.index] === tileId) return;
    onDrag(locateSource(tileId, board), target);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <PlayfieldBody imageSrc={imageSrc} board={board} tray={tray} disabled={disabled} />
    </DndContext>
  );
}
