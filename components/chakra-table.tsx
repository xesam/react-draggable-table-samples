"use client";

import type React from "react";

import {useState} from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {people, type Person} from "@/lib/data";
import {reorderItems} from "@/lib/utils-dnd";
import {GripVertical} from "lucide-react";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {Table, Tag} from "@chakra-ui/react";

function SortableTableRow({person}: { person: Person }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: person.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.8 : 1,
        position: isDragging ? "relative" : "static",
        backgroundColor: isDragging ? "#f3f4f6" : undefined,
    } as React.CSSProperties;

    const getStatusColorScheme = (status: Person["status"]) => {
        switch (status) {
            case "active":
                return "green";
            case "inactive":
                return "red";
            case "pending":
                return "yellow";
            default:
                return "gray";
        }
    };

    return (
        <Table.Row ref={setNodeRef} style={style}>
            <Table.Cell width="40px" padding="0">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab flex items-center justify-center h-full"
                >
                    <GripVertical size={20} className="text-gray-400"/>
                </div>
            </Table.Cell>
            <Table.Cell>{person.name}</Table.Cell>
            <Table.Cell>{person.role}</Table.Cell>
            <Table.Cell>{person.email}</Table.Cell>
            <Table.Cell>
                <Tag.Root color={getStatusColorScheme(person.status)}>
                    <Tag.Label>{person.status}</Tag.Label>
                </Tag.Root>
            </Table.Cell>
        </Table.Row>
    );
}

export default function ChakraTable() {
    const [items, setItems] = useState<Person[]>(people);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            setItems((items) =>
                reorderItems(items, active.id as string, over.id as string)
            );
        }
    }

    return (
        <ChakraProvider value={defaultSystem}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader width="40px" padding="0"></Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Role</Table.ColumnHeader>
                            <Table.ColumnHeader>Email</Table.ColumnHeader>
                            <Table.ColumnHeader>Status</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <SortableContext
                            items={items.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((person) => (
                                <SortableTableRow key={person.id} person={person}/>
                            ))}
                        </SortableContext>
                    </Table.Body>
                </Table.Root>
            </DndContext>
        </ChakraProvider>
    );
}
