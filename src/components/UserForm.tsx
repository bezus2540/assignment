"use client";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

interface UserFormProps {
  user: User | null;
  onSave: (data: User) => void;
  onDelete: (hn: string) => void;
}

export default function UserForm({ user, onSave, onDelete }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    hn: "", firstName: "", lastName: "", phone: "", email: ""
  });

  useEffect(() => {
    if (user) setFormData(user);
    else setFormData({ hn: "", firstName: "", lastName: "", phone: "", email: "" });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-6 border-t pt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-2">เจ้าของ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1 */}
        <div className="flex items-center gap-2">
          <label className="w-24 bg-green-700 text-white text-center py-1 text-sm rounded">HN</label>
          <input name="hn" value={formData.hn} onChange={handleChange} className="border p-1 flex-1 rounded bg-gray-50" />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-12 bg-green-700 text-white text-center py-1 text-sm rounded">ชื่อ</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} className="border p-1 flex-1 rounded border-green-300" />
          <label className="w-16 bg-green-700 text-white text-center py-1 text-sm rounded">นามสกุล</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} className="border p-1 flex-1 rounded border-green-300" />
        </div>
        {/* Row 2 */}
        <div className="flex items-center gap-2">
          <label className="w-24 bg-green-700 text-white text-center py-1 text-sm rounded">เบอร์ติดต่อ</label>
          <input name="phone" value={formData.phone} onChange={handleChange} className="border p-1 flex-1 rounded border-green-300" />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-24 bg-green-700 text-white text-center py-1 text-sm rounded">Email</label>
          <input name="email" value={formData.email} onChange={handleChange} className="border p-1 flex-1 rounded border-green-300" />
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <button className="px-6 py-1 bg-gray-100 border rounded flex items-center gap-1 text-sm"><span>🔄</span> Cancel</button>
        <button onClick={() => onSave(formData)} className="px-6 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded flex items-center gap-1 text-sm"><span>➕</span> Add</button>
        <button onClick={() => onSave(formData)} className="px-6 py-1 bg-blue-500 text-white rounded flex items-center gap-1 text-sm"><span>💾</span> Save</button>
        <button onClick={() => onDelete(formData.hn)} className="px-6 py-1 bg-red-100 text-red-600 border border-red-200 rounded flex items-center gap-1 text-sm"><span>❌</span> Delete</button>
      </div>
    </div>
  );
}