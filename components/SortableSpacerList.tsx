"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

type Item = {
  id: string;
  label: string;
};

type Column = {
  id: string;
  items: Item[];
};

type Row = {
  id: string;
  columns: Column[];
};

const INITIAL_ROWS: Row[] = [
  {
    id: "row-1",
    columns: [
      {
        id: "column-1",
        items: [{ id: "a", label: "Item A" }],
      },
    ],
  },
  {
    id: "row-2",
    columns: [
      {
        id: "column-2",
        items: [{ id: "b", label: "Item B" }],
      },
    ],
  },
  {
    id: "row-3",
    columns: [
      {
        id: "column-3",
        items: [{ id: "c", label: "Item C" }],
      },
    ],
  },
];

/* -------------------------------------------------- */
/* Draggable item */
/* -------------------------------------------------- */

function DraggableItem({
  item,
}: {
  item: Item;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(
          transform
        ),
        opacity: isDragging ? 0.25 : 1,
      }}
      className="
        cursor-grab
        rounded-xl
        border
        bg-background
        p-5
        shadow-sm
        active:cursor-grabbing
      "
    >
      {item.label}
    </div>
  );
}

/* -------------------------------------------------- */
/* Left / right split zones */
/* -------------------------------------------------- */

function SplitDropZone({
  rowId,
  side,
}: {
  rowId: string;
  side: "left" | "right";
}) {
  const { setNodeRef, isOver } =
    useDroppable({
      id: `split:${rowId}:${side}`,
    });

  return (
    <div
      ref={setNodeRef}
      className={[
        "absolute inset-y-0 z-20 w-1/2",
        side === "left"
          ? "left-0"
          : "right-0",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-y-2 w-1 rounded-full",
          side === "left"
            ? "left-2"
            : "right-2",
          "transition-all",
          isOver
            ? "bg-primary opacity-100"
            : "opacity-0",
        ].join(" ")}
      />
    </div>
  );
}

/* -------------------------------------------------- */
/* Full-width row drop zone */
/* -------------------------------------------------- */

function FullRowDropZone({
  index,
}: {
  index: number;
}) {
  const { setNodeRef, isOver } =
    useDroppable({
      id: `row:${index}`,
    });

  return (
    <div
      ref={setNodeRef}
      className="relative h-6"
    >
      <div
        className={[
          "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full",
          "transition-all duration-150",
          isOver
            ? "bg-primary opacity-100"
            : "bg-transparent opacity-0",
        ].join(" ")}
      />
    </div>
  );
}

/* -------------------------------------------------- */
/* Row */
/* -------------------------------------------------- */

function Row({
  row,
  dragging,
}: {
  row: Row;
  dragging: boolean;
}) {
  return (
    <div
      className={[
        "relative grid gap-3",
        row.columns.length === 1
          ? "grid-cols-1"
          : "grid-cols-2",
      ].join(" ")}
    >
      {row.columns.map((column) => (
        <div
          key={column.id}
          className="min-w-0 space-y-3"
        >
          {column.items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      ))}

      {/* Only single-column rows can be split */}
      {dragging &&
        row.columns.length === 1 && (
          <>
            <SplitDropZone
              rowId={row.id}
              side="left"
            />

            <SplitDropZone
              rowId={row.id}
              side="right"
            />
          </>
        )}
    </div>
  );
}

/* -------------------------------------------------- */
/* Main component */
/* -------------------------------------------------- */

export default function SplitLayout() {
  const [rows, setRows] =
    useState<Row[]>(INITIAL_ROWS);

  const [activeId, setActiveId] =
    useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function handleDragStart(event: any) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = String(active.id);
    const target = String(over.id);

    /* ------------------------------------------ */
    /* Split an existing row */
    /* ------------------------------------------ */

    if (target.startsWith("split:")) {
      const [, rowId, side] =
        target.split(":");

      splitIntoRow(
        activeId,
        rowId,
        side as "left" | "right"
      );

      return;
    }

    /* ------------------------------------------ */
    /* Move item into a full-width row */
    /* ------------------------------------------ */

    if (target.startsWith("row:")) {
      const targetIndex = Number(
        target.replace("row:", "")
      );

      moveToFullRow(
        activeId,
        targetIndex
      );

      return;
    }
  }

  /* -------------------------------------------- */
  /* Split into a row */
  /* -------------------------------------------- */

  function splitIntoRow(
    itemId: string,
    rowId: string,
    side: "left" | "right"
  ) {
    setRows((current) => {
      const source = findItem(
        current,
        itemId
      );

      if (!source) return current;

      /*
       * Don't split the item against
       * its own row.
       */
      if (source.row.id === rowId) {
        return current;
      }

      const next = cloneRows(current);

      const sourceRow =
        next.find(
          (row) =>
            row.id === source.row.id
        );

      const targetRow =
        next.find(
          (row) => row.id === rowId
        );

      if (!sourceRow || !targetRow) {
        return current;
      }

      const item =
        removeItem(
          sourceRow,
          itemId
        );

      if (!item) return current;

      /*
       * Only allow splitting a
       * single-column row.
       */
      if (
        targetRow.columns.length !== 1
      ) {
        return current;
      }

      const existing =
        targetRow.columns[0];

      const newColumn: Column = {
        id: crypto.randomUUID(),
        items: [item],
      };

      targetRow.columns =
        side === "left"
          ? [newColumn, existing]
          : [existing, newColumn];

      removeEmptyRows(next);

      return next;
    });
  }

  /* -------------------------------------------- */
  /* Move item into a full-width row */
  /* -------------------------------------------- */

  function moveToFullRow(
    itemId: string,
    targetIndex: number
  ) {
    setRows((current) => {
      const source = findItem(
        current,
        itemId
      );

      if (!source) return current;

      const next = cloneRows(current);

      /*
       * Remove the item from its
       * current column.
       */
      const sourceRow =
        next.find(
          (row) =>
            row.id === source.row.id
        );

      if (!sourceRow) return current;

      const item =
        removeItem(
          sourceRow,
          itemId
        );

      if (!item) return current;

      removeEmptyRows(next);

      /*
       * Insert a brand new full-width
       * row at the requested position.
       */
      const newRow: Row = {
        id: crypto.randomUUID(),
        columns: [
          {
            id: crypto.randomUUID(),
            items: [item],
          },
        ],
      };

      /*
       * Clamp index after removing
       * the source row.
       */
      const index = Math.min(
        Math.max(targetIndex, 0),
        next.length
      );

      next.splice(index, 0, newRow);

      return next;
    });
  }

  const activeItem = rows
    .flatMap((row) =>
      row.columns.flatMap(
        (column) => column.items
      )
    )
    .find(
      (item) => item.id === activeId
    );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() =>
        setActiveId(null)
      }
    >
      <div className="mx-auto w-full max-w-2xl  space-y-4">
        {rows.map((row, index) => (
          <div key={row.id}>
            <Row
              row={row}
              dragging={activeId !== null}
            />

            {/* Full-width drop area */}
            {activeId !== null && (
              <FullRowDropZone
                index={index + 1}
              />
            )}
          </div>
        ))}

        {/* Drop above everything */}
        {activeId !== null && (
          <FullRowDropZone index={0} />
        )}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="rounded-xl border bg-background p-5 shadow-2xl">
            {activeItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* ================================================== */
/* Helpers */
/* ================================================== */

function cloneRows(rows: Row[]): Row[] {
  return rows.map((row) => ({
    ...row,
    columns: row.columns.map(
      (column) => ({
        ...column,
        items: [...column.items],
      })
    ),
  }));
}

function findItem(
  rows: Row[],
  itemId: string
) {
  for (const row of rows) {
    for (const column of row.columns) {
      const item = column.items.find(
        (item) => item.id === itemId
      );

      if (item) {
        return {
          item,
          row,
          column,
        };
      }
    }
  }

  return null;
}

function removeItem(
  row: Row,
  itemId: string
): Item | null {
  for (const column of row.columns) {
    const index = column.items.findIndex(
      (item) => item.id === itemId
    );

    if (index !== -1) {
      const [item] =
        column.items.splice(index, 1);

      return item;
    }
  }

  return null;
}

function removeEmptyRows(rows: Row[]) {
  for (let i = rows.length - 1; i >= 0; i--) {
    rows[i].columns =
      rows[i].columns.filter(
        (column) =>
          column.items.length > 0
      );

    if (rows[i].columns.length === 0) {
      rows.splice(i, 1);
    }
  }
}