import { useState, useEffect, useRef } from "react";
import {
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaSpinner,
  FaCreditCard,
} from "react-icons/fa";
import api from "../../../api/axiosInstance";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    SUCCESS: {
      container: "bg-green-100 text-green-700",
      icon: <FaCheckCircle className="text-green-500 text-xs" />,
      label: "Paid",
    },
    PENDING: {
      container: "bg-yellow-100 text-yellow-700",
      icon: <FaExclamationCircle className="text-yellow-500 text-xs" />,
      label: "Pending",
    },
    FAILED: {
      container: "bg-red-100 text-red-600",
      icon: <FaTimesCircle className="text-red-500 text-xs" />,
      label: "Failed",
    },
  };

  const style = styles[status] || styles.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.container}`}
    >
      {style.icon}
      {style.label}
    </span>
  );
}

// ─── Receipt Generator ────────────────────────────────────────────────────────

const downloadReceipt = (payment) => {
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const matricNumber = localStorage.getItem("matricNumber") || "N/A";
  const department = localStorage.getItem("department") || "N/A";

  const formatAmount = (amount) =>
    `NGN ${Number(amount).toLocaleString("en-NG")}`;

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Payment Receipt - ${payment.reference}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
          .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #1e3a8a; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
          .header p { color: #6b7280; font-size: 13px; margin-top: 4px; }
          .badge { display: inline-block; background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .row .label { font-size: 13px; color: #6b7280; }
          .row .value { font-size: 13px; font-weight: 700; color: #1a1a1a; text-align: right; }
          .amount-row .value { font-size: 20px; font-weight: 900; color: #1e3a8a; }
          .footer { margin-top: 40px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          .footer p { font-size: 11px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Comprehensive University</h1>
          <p>Official Payment Receipt</p>
          <span class="badge">&#10003; Payment Successful</span>
        </div>

        <div class="section">
          <div class="section-title">Student Information</div>
          <div class="row">
            <span class="label">Full Name</span>
            <span class="value">${firstName} ${lastName}</span>
          </div>
          <div class="row">
            <span class="label">Matric Number</span>
            <span class="value">${matricNumber}</span>
          </div>
          <div class="row">
            <span class="label">Department</span>
            <span class="value">${department}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Details</div>
          <div class="row">
            <span class="label">Reference</span>
            <span class="value">${payment.reference}</span>
          </div>
          <div class="row">
            <span class="label">Session</span>
            <span class="value">${payment.session || "N/A"}</span>
          </div>
          <div class="row">
            <span class="label">Date Paid</span>
            <span class="value">${formatDate(payment.paidAt)}</span>
          </div>
          <div class="row">
            <span class="label">Payment Status</span>
            <span class="value" style="color: #15803d;">SUCCESS</span>
          </div>
          <div class="row amount-row" style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e5e7eb;">
            <span class="label" style="font-size: 15px; font-weight: 700; color: #1a1a1a;">Amount Paid</span>
            <span class="value">${formatAmount(payment.amount)}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is an electronically generated receipt and is valid without a signature.</p>
          <p style="margin-top: 6px;">Comprehensive University &mdash; Academic Excellence Since 1869</p>
        </div>
      </body>
    </html>
  `;

  const receiptWindow = window.open("", "_blank");
  receiptWindow.document.write(receiptHTML);
  receiptWindow.document.close();
  receiptWindow.focus();
  setTimeout(() => {
    receiptWindow.print();
  }, 500);
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [verifying, setVerifying] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Use a ref so the Pay Fees button always reads the latest registrationId
  // even if it was fetched after the component mounted
  const registrationIdRef = useRef(
    localStorage.getItem("registrationId") || null,
  );

  // ── Fetch Payments + Fallback registrationId ──────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Run both in parallel
        const [paymentsRes, regRes] = await Promise.allSettled([
          api.get("/payments/my-payments"),
          // Only fetch current registration if we don't already have the ID
          registrationIdRef.current
            ? Promise.resolve(null)
            : api.get("/registrations/current"),
        ]);

        // 1. Payment history
        if (paymentsRes.status === "fulfilled") {
          setPayments(paymentsRes.value.data.data || []);
        } else {
          setMessage({
            type: "error",
            text: "Failed to load payment history. Please refresh.",
          });
        }

        // 2. Registration ID fallback
        if (regRes.status === "fulfilled" && regRes.value !== null) {
          const reg = regRes.value.data.data;
          if (reg?._id) {
            localStorage.setItem("registrationId", reg._id);
            registrationIdRef.current = reg._id;
          }
        }
      } catch (err) {
        console.error("Payment page fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Computed Summary ──────────────────────────────────────────────────────
  const totalPaid = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const formatAmount = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  // ── Initiate Payment ──────────────────────────────────────────────────────
  const handleInitiatePayment = async () => {
    if (!registrationIdRef.current) {
      setMessage({
        type: "error",
        text: "No active registration found. Please complete course registration first.",
      });
      return;
    }

    try {
      setInitiating(true);
      setMessage({ type: "", text: "" });

      const res = await api.post("/payments/initiate", {
        registrationId: registrationIdRef.current,
      });
      const { authorizationUrl } = res.data.data;

      // Redirect to Paystack — webhook updates feesPaid automatically after payment
      window.location.href = authorizationUrl;
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to initiate payment. Try again.",
      });
    } finally {
      setInitiating(false);
    }
  };

  // ── Verify Payment ────────────────────────────────────────────────────────
  const handleVerify = async (reference) => {
    try {
      setVerifying(reference);
      const res = await api.get(`/payments/verify/${reference}`);
      const verified = res.data.data;

      setPayments((prev) =>
        prev.map((p) =>
          p.reference === reference ? { ...p, status: verified.status } : p,
        ),
      );

      setMessage({
        type: "success",
        text: `Payment verified — status: ${verified.status}`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Verification failed.",
      });
    } finally {
      setVerifying(null);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-900">
        <FaSpinner className="animate-spin text-4xl mb-4" />
        <p className="font-bold tracking-wide text-sm uppercase">
          Loading Payment Info...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Payment Info</h1>
          <p className="text-sm text-gray-500 mt-1">
            View your payment history and pay your fees.
          </p>
        </div>
        <button
          onClick={handleInitiatePayment}
          disabled={initiating}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-colors duration-200 shadow-sm"
        >
          {initiating ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaCreditCard />
          )}
          {initiating ? "Redirecting to Paystack..." : "Pay Fees"}
        </button>
      </div>

      {/* ── Message Banner ── */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-bold border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Payments", value: payments.length, highlight: false },
          {
            label: "Total Paid",
            value: formatAmount(totalPaid),
            highlight: false,
          },
          {
            label: "Pending",
            value: formatAmount(totalPending),
            highlight: true,
          },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`rounded-xl px-6 py-6 flex flex-col gap-2 border transition-all duration-200 ${
              highlight
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-200 hover:border-blue-900 hover:shadow-md"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaMoneyBillWave
                className={`text-base ${highlight ? "text-red-500" : "text-blue-900"}`}
              />
            </div>
            <p
              className={`text-2xl font-black ${highlight ? "text-red-600" : "text-blue-900"}`}
            >
              {value}
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Payment History Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-black text-gray-800 uppercase tracking-wide">
            Payment History
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {payments.length} record{payments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">
            No payment records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Reference",
                    "Session",
                    "Amount",
                    "Date Paid",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-black text-gray-500 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr
                    key={payment.reference}
                    className="hover:bg-blue-50 group transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-gray-400 font-mono">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors">
                      {payment.session || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-800">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(payment.paidAt)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Verify — pending payments */}
                        {payment.status === "PENDING" && (
                          <button
                            onClick={() => handleVerify(payment.reference)}
                            disabled={verifying === payment.reference}
                            className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 hover:underline disabled:opacity-50"
                          >
                            {verifying === payment.reference ? (
                              <FaSpinner className="animate-spin text-xs" />
                            ) : (
                              <FaExclamationCircle className="text-xs" />
                            )}
                            Verify
                          </button>
                        )}

                        {/* Download Receipt — successful payments */}
                        {payment.status === "SUCCESS" && (
                          <button
                            onClick={() => downloadReceipt(payment)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline"
                          >
                            <FaDownload className="text-xs" />
                            Receipt
                          </button>
                        )}

                        {payment.status === "FAILED" && (
                          <span className="text-xs text-gray-300 font-medium">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
