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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {people, type Person} from "@/lib/data"
import {reorderItems} from "@/lib/utils-dnd"
import {GripVertical} from "lucide-react"
import {ThemeProvider, createTheme} from "@mui/material/styles"
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip} from "@mui/material"
import {restrictToParentElement, restrictToVerticalAxis} from "@dnd-kit/modifiers";

const theme = createTheme({
    typography: {
        fontFamily: "var(--font-sans)",
    },
})

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

    const getStatusColor = (status: Person["status"]) => {
        switch (status) {
            case "active":
                return "success"
            case "inactive":
                return "error"
            case "pending":
                return "warning"
            default:
                return "default"
        }
    }

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell padding="none" width="40px">
                <div {...attributes} {...listeners} className="cursor-grab flex items-center justify-center h-full">
                    <GripVertical size={20} className="text-gray-400"/>
                </div>
            </TableCell>
            <TableCell>{person.name}</TableCell>
            <TableCell>{person.role}</TableCell>
            <TableCell>{person.email}</TableCell>
            <TableCell>
                <Chip label={person.status} color={getStatusColor(person.status)} size="small"/>
            </TableCell>
        </TableRow>
    )
}

export default function MuiTable() {
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
        <ThemeProvider theme={theme}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="none" width="40px"></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <SortableContext items={items.map((item) => item.id)}
                                             strategy={verticalListSortingStrategy}>
                                {items.map((person) => (
                                    <SortableTableRow key={person.id} person={person}/>
                                ))}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DndContext>
        </ThemeProvider>
    )
}
