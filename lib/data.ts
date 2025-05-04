export type Person = {
    id: string
    name: string
    role: string
    email: string
    status: "active" | "inactive" | "pending"
}

export const people: Person[] = [
    {
        id: "1",
        name: "John Smith",
        role: "Software Engineer",
        email: "john.smith@example.com",
        status: "active",
    },
    {
        id: "2",
        name: "Sarah Johnson",
        role: "Product Manager",
        email: "sarah.johnson@example.com",
        status: "active",
    },
    {
        id: "3",
        name: "Michael Brown",
        role: "UI Designer",
        email: "michael.brown@example.com",
        status: "inactive",
    },
    {
        id: "4",
        name: "Emily Davis",
        role: "Data Scientist",
        email: "emily.davis@example.com",
        status: "active",
    },
    {
        id: "5",
        name: "David Wilson",
        role: "DevOps Engineer",
        email: "david.wilson@example.com",
        status: "pending",
    },
    {
        id: "6",
        name: "Jessica Lee",
        role: "UX Designer",
        email: "jessica.lee@example.com",
        status: "active",
    },
    {
        id: "7",
        name: "Daniel Kim",
        role: "Backend Developer",
        email: "daniel.kim@example.com",
        status: "inactive",
    },
    {
        id: "8",
        name: "Amy Chen",
        role: "Frontend Developer",
        email: "amy.chen@example.com",
        status: "active",
    },
    {
        id: "9",
        name: "James Chen",
        role: "Full Stack Developer",
        email: "james.chen@example.com",
        status: "pending",
    },
]
