import {
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

//  Mock Data

const SUMMARY = [
  { label: "Total Payable", value: "₦150,000" },
  { label: "Total Paid", value: "₦100,000" },
  { label: "Outstanding", value: "₦50,000" },
];

const PAYMENTS = [
  {
    id: "RCP-2024-001",
    description: "School Fees — 1st Semester",
    amount: "₦80,000",
    date: "Sep 5, 2024",
    status: "Paid",
  },
  {
    id: "RCP-2024-002",
    description: "Library Levy",
    amount: "₦5,000",
    date: "Sep 5, 2024",
    status: "Paid",
  },
  {
    id: "RCP-2024-003",
    description: "Accommodation Fee",
    amount: "₦40,000",
    date: "Sep 10, 2024",
    status: "Pending",
  },
  {
    id: "RCP-2024-004",
    description: "Student Union Dues",
    amount: "₦2,000",
    date: "Sep 10, 2024",
    status: "Paid",
  },
  {
    id: "RCP-2024-005",
    description: "Sports & Recreation Levy",
    amount: "₦3,000",
    date: "Oct 1, 2024",
    status: "Overdue",
  },
  {
    id: "RCP-2024-006",
    description: "Medical/Health Insurance",
    amount: "₦5,000",
    date: "Oct 1, 2024",
    status: "Pending",
  },
  {
    id: "RCP-2024-007",
    description: "ICT/Laboratory Levy",
    amount: "₦15,000",
    date: "Oct 15, 2024",
    status: "Overdue",
  },
];

//  Badge Component

function StatusBadge({ status }) {
  const styles = {
    Paid: {
      container: "bg-green-100 text-green-700",
      icon: <FaCheckCircle className="text-green-500 text-xs" />,
    },
    Pending: {
      container: "bg-yellow-100 text-yellow-700",
      icon: <FaExclamationCircle className="text-yellow-500 text-xs" />,
    },
    Overdue: {
      container: "bg-red-100 text-red-600",
      icon: <FaTimesCircle className="text-red-500 text-xs" />,
    },
  };

  const { container, icon } = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${container}`}
    >
      {icon}
      {status}
    </span>
  );
}

//  Page

export default function PaymentInfoPage() {
  const handleDownload = (id) => {
    // hook up receipt download logic here
    alert(`Downloading receipt for ${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/*  Page Header  */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Payment Info</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your fee breakdown, payment history, and download receipts.
        </p>
      </div>

      {/*  Summary Cards  */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUMMARY.map(({ label, value }, i) => (
          <div
            key={label}
            className={`rounded-xl px-6 py-6 flex flex-col gap-2 border ${
              i === 2
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200 hover:border-blue-900 hover:shadow-md"
            } transition-all duration-200`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaMoneyBillWave
                className={`text-base ${i === 2 ? "text-red-500" : "text-blue-900"}`}
              />
            </div>
            <p
              className={`text-2xl font-black ${i === 2 ? "text-red-600" : "text-blue-900"}`}
            >
              {value}
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/*  Payment History Table  */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Payment History
          </p>
          <p className="text-xs text-gray-400 font-medium">2024/2025 Session</p>
        </div>

        {/* Table — desktop */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Receipt ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Description
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PAYMENTS.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-blue-50 group transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors">
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-800">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === "Paid" ? (
                      <button
                        onClick={() => handleDownload(payment.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline"
                      >
                        <FaDownload className="text-xs" />
                        Download
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300 font-medium">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
