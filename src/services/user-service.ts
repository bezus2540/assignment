import { User } from "@/types/user";
export async function updateUser(hn: string, data: User) {
  try {
    const response = await fetch(`/api/users/${hn}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (error) {
    console.error("DRY violation prevented by centralizing API logic:", error);
  }
}