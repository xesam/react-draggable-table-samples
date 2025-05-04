"use client"

import type React from "react"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { people, type Person } from "@/lib/data"
import { reorderItems } from "@/lib/utils-dnd"
import { GripVertical } from "lucide-react"
import { MantineProvider, createTheme } from "@mantine/core"
import { Table, Badge } from "@mantine/core"
import '@mantine/core/styles.css';


const theme = createTheme({
  fontFamily: "var(--font-sans)",
})

function SortableTableRow({ person }: { person: Person }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: person.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" : "static",
    backgroundColor: isDragging ? "#f3f4f6" : undefined,
  } as React.CSSProperties

  const getStatusColor = (status: Person["status"]) => {
    switch (status) {
      case "active":
        return "green"
      case "inactive":
        return "red"
      case "pending":
        return "yellow"
      default:
        return "gray"
    }
  }

  return (
    <Table.Tr ref={setNodeRef} style={style}>
      <Table.Td style={{ width: "40px", padding: "0" }}>
        <div {...attributes} {...listeners} className="cursor-grab flex items-center justify-center h-full">
          <GripVertical size={20} className="text-gray-400" />
        </div>
      </Table.Td>
      <Table.Td>{person.name}</Table.Td>
      <Table.Td>{person.role}</Table.Td>
      <Table.Td>{person.email}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(person.status)}>{person.status}</Badge>
      </Table.Td>
    </Table.Tr>
  )
}

export default function MantineTable() {
  const [items, setItems] = useState<Person[]>(people)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => reorderItems(items, active.id as string, over.id as string))
    }
  }

  return (
    <MantineProvider theme={theme}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: "40px", padding: "0" }}></Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((person) => (
                <SortableTableRow key={person.id} person={person} />
              ))}
            </SortableContext>
          </Table.Tbody>
        </Table>
      </DndContext>
    </MantineProvider>
  )
}
