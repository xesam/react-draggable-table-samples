"use client"

import type React from "react"

import {useState} from "react"
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
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {people, type Person} from "@/lib/data"
import {reorderItems, getStatusColor} from "@/lib/utils-dnd"
import {GripVertical} from "lucide-react"

function SortableTableRow({person}: { person: Person }) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: person.id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.8 : 1,
        position: isDragging ? "relative" : "static",
        backgroundColor: isDragging ? "#f3f4f6" : undefined,
    } as React.CSSProperties

    return (
        <tr ref={setNodeRef} style={style} className="border-b hover:bg-gray-50 transition-colors">
            <td className="p-2 w-10">
                <div {...attributes} {...listeners} className="cursor-grab flex items-center justify-center h-full">
                    <GripVertical size={20} className="text-gray-400"/>
                </div>
            </td>
            <td className="p-3">{person.name}</td>
            <td className="p-3">{person.role}</td>
            <td className="p-3">{person.email}</td>
            <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}>
                  {person.status}
                </span>
            </td>
        </tr>
    )
}

export default function HtmlTable() {
    const [items, setItems] = useState<Person[]>(people)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event

        if (over && active.id !== over.id) {
            setItems((items) => reorderItems(items, active.id as string, over.id as string))
        }
    }

    return (
        <div className="overflow-x-auto">
            <DndContext sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 w-10"></th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        {items.map((person) => (
                            <SortableTableRow key={person.id} person={person}/>
                        ))}
                    </SortableContext>
                    </tbody>
                </table>
            </DndContext>
        </div>
    )
}
