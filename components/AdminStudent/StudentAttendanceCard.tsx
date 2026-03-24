export function StudentAttendanceCard() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="font-semibold mb-4">Attendance Overview</h3>

      <div className="flex justify-between text-sm">
        <span>Present</span>
        <span className="font-medium text-green-600">85%</span>
      </div>

      <div className="flex justify-between text-sm mt-2">
        <span>Absent</span>
        <span className="font-medium text-red-600">10%</span>
      </div>

      <div className="flex justify-between text-sm mt-2">
        <span>Leave</span>
        <span className="font-medium text-yellow-600">5%</span>
      </div>
    </div>
  );
}
