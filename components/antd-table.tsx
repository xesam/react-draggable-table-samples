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
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { people, type Person } from "@/lib/data"
import { reorderItems } from "@/lib/utils-dnd"
import { GripVertical } from "lucide-react"
import { ConfigProvider, Table, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"

interface DraggableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string
  children: React.ReactNode
}

const DraggableRow = ({ children, "data-row-key": dataRowKey, ...props }: DraggableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dataRowKey })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" : "static",
    backgroundColor: isDragging ? "#f3f4f6" : undefined,
  }

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tr>
  )
}

export default function AntdTable() {
  const [items, setItems] = useState<Person[]>(people)

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => reorderItems(items, active.id as string, over.id as string))
    }
  }

  const columns: ColumnsType<Person> = [
    {
      key: "sort",
      width: 30,
      render: () => <GripVertical size={20} className="text-gray-400" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Person["status"]) => {
        let color = ""
        switch (status) {
          case "active":
            color = "green"
            break
          case "inactive":
            color = "red"
            break
          case "pending":
            color = "gold"
            break
          default:
            color = "default"
        }
        return <Tag color={color}>{status}</Tag>
      },
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "var(--font-sans)",
        },
      }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <Table
            components={{
              body: {
                row: DraggableRow,
              },
            }}
            rowKey="id"
            columns={columns}
            dataSource={items}
            pagination={false}
          />
        </SortableContext>
      </DndContext>
    </ConfigProvider>
  )
}
