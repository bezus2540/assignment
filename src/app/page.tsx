"use client";
import { useState } from "react";
import { User } from "@/types/user";
import UserForm from "@/components/UserForm";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";


const findUserByHN = (users: User[], hn: string) =>
  users.find((u) => u.hn === hn);

const paginate = (data: User[], currentPage: number, pageSize: number) => {
  const totalItems = data.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  return { totalItems, totalPages, currentData };
};

const initialUsers: User[] = [
  { hn: "002530", firstName: "พลพิชัย ", lastName: "แตงอ่อน", phone: "0946236355", email: "ttttt@hotmail.com" },
  { hn: "002512", firstName: "อดิศักดิ์ ", lastName: "ซุยกระเดื่อง", phone: "0930914384", email: "aaaaa@gmail.com" },
  { hn: "002549", firstName: "สรวิศ", lastName: "ยืนยาว", phone: "0884959191", email: "ggggg@gmail.com" },
  { hn: "000424", firstName: "ธีรวัฒน์ ", lastName: "อุณาภาคย์", phone: "0885710057", email: "tttty@hotmail.com" },
  { hn: "000093", firstName: "ขวัญหทัย", lastName: "จอมคีรี", phone: "0885522602", email: "ijiji@gmail.com" },
];

export default function AssignmentPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { totalItems, totalPages, currentData } = paginate(
    users,
    currentPage,
    pageSize
  );

  // 🔹 Async เผื่อ backend 
  const handleSave = async (userData: User) => {
    try {
      const exists = findUserByHN(users, userData.hn);

      if (exists) {
        setUsers((prev) =>
          prev.map((u) => (u.hn === userData.hn ? userData : u))
        );
      } else {
        setUsers((prev) => [...prev, userData]);
      }

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (hn: string) => {
    if (!confirm("คุณต้องการลบข้อมูลใช่หรือไม่?")) return;

    try {
      setUsers((prev) => prev.filter((u) => u.hn !== hn));
      setSelectedUser(null);

      if (currentData.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCancelSelection = () => {
  setSelectedUser(null);
  };

  return (
    <main className="p-4 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-blue-900 mb-4">ค้นหาเจ้าของ</h1>

        <div className="bg-white rounded-md shadow-sm overflow-hidden border">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-600">
                <th className="p-3 border-r w-24 text-center">Operation</th>
                <th className="p-3 border-r">HN เจ้าของ</th>
                <th className="p-3 border-r">ชื่อเจ้าของ</th>
                <th className="p-3 border-r">เบอร์ติดต่อ</th>
                <th className="p-3">อีเมล์</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((user) => (
                <tr key={user.hn} className="border-b hover:bg-blue-50">
                  <td className="p-2 border-r text-center">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-1 border rounded"
                    >
                      <FileText size={18} />
                    </button>
                  </td>

                  <td className="p-3 border-r">{user.hn}</td>

                  <td className="p-3 border-r text-blue-600 font-medium uppercase">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="hover:underline text-left"
                    >
                      {user.firstName} {user.lastName}
                    </button>
                  </td>

                  <td className="p-3 border-r">{user.phone}</td>
                  <td className="p-3">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination คำนวณจำนวนdata */}
          <div className="p-3 flex justify-between items-center border-t text-xs">
            <div>
              Page {currentPage} of {totalPages} ({totalItems} items)
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 border rounded"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded ${
                      currentPage === page ? "bg-blue-500 text-white" : "border"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1 border rounded"
              >
                <ChevronRight size={14} />
              </button>

              <select
                className="border rounded p-1 ml-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={handleCancelSelection}
        />
      </div>
    </main>
  );
}