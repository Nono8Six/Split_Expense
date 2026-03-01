import { User } from "../../../types";

export async function deleteUser(id: string): Promise<void> {
    // Mock localStorage delete
    const data = localStorage.getItem("users");
    if (data) {
        const users: User[] = JSON.parse(data);
        const updated = users.filter((u) => u.id !== id);
        localStorage.setItem("users", JSON.stringify(updated));
    }
}
