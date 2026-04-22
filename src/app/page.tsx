"use client";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import UserForm from "@/components/UserForm";
import { FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// 🔗 นำ URL ที่ได้จาก Apps Script มาใส่ตรงนี้
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxYoTikMjZSrUDtzEAtC_D-UrC_SEtIPKbuf91GjkLL-LEk-wriSIUz850s72sOx5xA/exec";

export default function AssignmentPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 🔹 ดึงข้อมูลจาก Google Sheets
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(WEB_APP_URL);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const paginate = (data: User[], currentPage: number, pageSize: number) => {
    const totalItems = data.length;
    const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentData = data.slice(startIndex, startIndex + pageSize);
    return { totalItems, totalPages, currentData };
  };

  const { totalItems, totalPages, currentData } = paginate(users, currentPage, pageSize);

  const handleSave = async (userData: User) => {
    try {
      setLoading(true);
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // จำเป็นสำหรับ Google Apps Script
        body: JSON.stringify({ ...userData, action: "save" }),
      });
      // เนื่องจาก no-cors เราจะมองไม่เห็น response แนะนำให้หน่วงเวลาเล็กน้อยแล้ว fetch ใหม่
      setTimeout(() => {
        fetchUsers();
        alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (hn: string) => {
    if (!confirm("คุณต้องการลบข้อมูลใช่หรือไม่?")) return;
    try {
      setLoading(true);
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ hn, action: "delete" }),
      });
      setTimeout(() => {
        fetchUsers();
        setSelectedUser(null);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelSelection = () => setSelectedUser(null);

  return (
    <main className="p-4 md:p-10 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-900">ค้นหาเจ้าของ (Connected to Sheet)</h1>
          {loading && <Loader2 className="animate-spin text-blue-500" />}
        </div>

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
              {currentData.length > 0 ? (
                currentData.map((user) => (
                  <tr key={user.hn} className="border-b hover:bg-blue-50">
                    <td className="p-2 border-r text-center">
                      <button onClick={() => setSelectedUser(user)} className="p-1 border rounded">
                        <FileText size={18} />
                      </button>
                    </td>
                    <td className="p-3 border-r">{user.hn}</td>
                    <td className="p-3 border-r text-blue-600 font-medium uppercase">
                      <button onClick={() => setSelectedUser(user)} className="hover:underline text-left">
                        {user.firstName} {user.lastName}
                      </button>
                    </td>
                    <td className="p-3 border-r">{user.phone}</td>
                    <td className="p-3">{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">ไม่พบข้อมูล</td></tr>
              )}
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