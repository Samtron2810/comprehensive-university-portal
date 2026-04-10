import { useEffect, useState } from "react";
import {
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaSpinner,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");
};

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

export default function PaymentInfoPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Replace with your actual financial endpoint
        const response = await api.get(`/payments/student/${studentId}`);
        setPayments(response.data.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchPayments();
  }, [studentId]);

  // Calculate Summary
  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalOutstanding = payments
    .filter((p) => p.status !== "Paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const SUMMARY = [
    {
      label: "Total Payable",
      value: formatCurrency(totalPaid + totalOutstanding),
    },
    { label: "Total Paid", value: formatCurrency(totalPaid) },
    { label: "Outstanding", value: formatCurrency(totalOutstanding) },
  ];

  const handleDownload = (id) => {
    alert(`Generating PDF Receipt for Transaction: ${id}`);
    // You can use libraries like jsPDF here later
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-900">
        <FaSpinner className="animate-spin text-3xl mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">
          Loading Financial Records...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Payment Info</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your fee breakdown, payment history, and download receipts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUMMARY.map(({ label, value }, i) => (
          <div
            key={label}
            className={`rounded-xl px-6 py-6 flex flex-col gap-2 border ${
              i === 2 && totalOutstanding > 0
                ? "bg-red-50 border-red-200 shadow-sm"
                : "bg-white border-gray-200 hover:border-blue-900"
            } transition-all duration-200`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 2 ? "bg-red-100" : "bg-blue-100"}`}
            >
              <FaMoneyBillWave
                className={`text-base ${i === 2 ? "text-red-500" : "text-blue-900"}`}
              />
            </div>
            <p
              className={`text-2xl font-black ${i === 2 && totalOutstanding > 0 ? "text-red-600" : "text-blue-900"}`}
            >
              {value}
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Payment History Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Payment History
          </p>
          <p className="text-xs text-gray-400 font-medium">
            Academic Session 2024/2025
          </p>
        </div>

        <div className="overflow-x-auto">
          {payments.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                    Receipt ID
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-black text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr
                    key={payment._id || payment.id}
                    className="hover:bg-blue-50 group transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                      {payment.transactionRef || payment.id || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700 group-hover:text-blue-900">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-800">
                      {formatCurrency(payment.amount)}
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
                          <FaDownload /> Download
                        </button>
                      ) : (
                        <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-900 hover:text-white transition-all">
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center">
              <FaMoneyBillWave className="mx-auto text-gray-200 text-5xl mb-4" />
              <p className="text-gray-500 font-medium">
                No payment records found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
