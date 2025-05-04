"use client"

import type React from "react"
import {useState} from "react"
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {people, type Person} from "@/lib/data"
import {reorderItems} from "@/lib/utils-dnd"
import {GripVertical} from "lucide-react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/shadcn/components/ui/table"
import {Badge} from "@/shadcn/components/ui/badge"
import {restrictToParentElement, restrictToVerticalAxis} from "@dnd-kit/modifiers";

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
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-10">
                <div {...attributes} {...listeners} className="cursor-grab flex items-center justify-center h-full">
                    <GripVertical size={20} className="text-gray-400"/>
                </div>
            </TableCell>
            <TableCell>{person.name}</TableCell>
            <TableCell>{person.role}</TableCell>
            <TableCell>{person.email}</TableCell>
            <TableCell>
                <Badge
                    variant={person.status === "active" ? "success" : person.status === "inactive" ? "destructive" : "outline"}
                >
                    {person.status}
                </Badge>
            </TableCell>
        </TableRow>
    )
}

export default function ShadcnTable() {
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
        <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                            {items.map((person) => (
                                <SortableTableRow key={person.id} person={person}/>
                            ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    )
}
