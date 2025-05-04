import { arrayMove } from "@dnd-kit/sortable"
import type { Person } from "./data"

export function reorderItems<T>(items: T[], activeId: string, overId: string): T[] {
  const oldIndex = items.findIndex((item) => (item as unknown as { id: string }).id === activeId)
  const newIndex = items.findIndex((item) => (item as unknown as { id: string }).id === overId)

  return arrayMove(items, oldIndex, newIndex)
}

export function getStatusColor(status: Person["status"]) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
