import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
} from "react-icons/fa";

//data displayed
const SUPPORT_CHANNELS = [
  {
    icon: FaPhoneAlt,
    title: "Phone Support",
    detail: "(303) 631-9860",
    sub: "Mon – Fri, 8:00am – 5:00pm",
  },
  {
    icon: FaEnvelope,
    title: "Email Support",
    detail: "support@cungmail.com",
    sub: "Response within 24 hours",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Visit Us",
    detail: "Student Affairs Building",
    sub: "Room 101, Main Campus",
  },
];

const RESOURCES = [
  { label: "Student Handbook", href: "#" },
  { label: "Academic Calendar", href: "#" },
  { label: "Fee Payment Guide", href: "#" },
  { label: "Course Registration Guide", href: "#" },
  { label: "Exam Timetable", href: "#" },
  { label: "Hostel Allocation Portal", href: "#" },
];

const FAQS = [
  {
    question: "How do I reset my student portal password?",
    answer:
      "Visit the login page and click 'Forgot Password'. Enter your registered email address and follow the reset instructions sent to your inbox.",
  },
  {
    question: "When is the deadline for course registration?",
    answer:
      "Course registration deadlines are published in the Academic Calendar. Typically, registration closes two weeks after the semester resumption date.",
  },
  {
    question: "How do I check my semester results?",
    answer:
      "Log in to your student portal and navigate to the 'Grades' section. Results are published by the Examinations & Records office after ratification.",
  },
  {
    question: "How do I apply for a deferral or leave of absence?",
    answer:
      "Submit a formal application to your Faculty Officer with supporting documents. The application is reviewed by the Academic Board within 10 working days.",
  },
  {
    question: "Where can I get my student ID card?",
    answer:
      "Student ID cards are issued at the ICT Centre after completing your registration and uploading a passport photograph on the portal.",
  },
];

// faq items
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-bold text-gray-800 pr-4">{question}</span>
        {open ? (
          <FaChevronUp className="text-blue-900 shrink-0 text-xs" />
        ) : (
          <FaChevronDown className="text-gray-400 shrink-0 text-xs" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-gray-100 bg-blue-50">
          <p className="text-sm text-gray-600 leading-relaxed pt-4">{answer}</p>
        </div>
      )}
    </div>
  );
}

// contact form
function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-1">
        Send a Message
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Fill out the form below and our support team will get back to you.
      </p>

      {sent ? (
        <div className="p-5 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm font-bold text-green-800">
            ✅ Message sent! We'll respond within 24 hours.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 transition-colors"
            />
            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 transition-colors"
            />
          </div>
          <input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 transition-colors"
          />
          <textarea
            name="message"
            placeholder="Your message..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 transition-colors resize-none"
          />
          <button
            onClick={handleSubmit}
            className="self-start bg-blue-900 hover:bg-blue-800 text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Send Message
          </button>
        </div>
      )}
    </div>
  );
}

// page displaying
export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/*  Page Hero  */}
        <section className="bg-blue-900 py-16 px-8 md:px-20">
          <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-3">
            Support
          </p>
          <h1 className="text-white font-black text-4xl md:text-5xl leading-tight max-w-2xl">
            We're Here <br /> to Help You.
          </h1>
          <p className="mt-4 text-blue-200 text-base leading-relaxed max-w-xl">
            Find answers, reach our support team, or browse helpful resources -
            all in one place.
          </p>
        </section>

        {/*  Help Desk / Support Channels  */}
        <section className="py-16 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
              Help Desk
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">
              Reach Our Support Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {SUPPORT_CHANNELS.map(({ icon: Icon, title, detail, sub }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center p-8 border border-gray-200 rounded-xl hover:border-blue-900 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-900 transition-colors duration-200 mb-4">
                    <Icon className="text-blue-900 group-hover:text-white text-lg transition-colors duration-200" />
                  </div>
                  <h3 className="text-sm font-black text-gray-800 mb-1">
                    {title}
                  </h3>
                  <p className="text-sm font-semibold text-blue-900">
                    {detail}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  Resource Links and Contact Form  */}
        <section className="bg-gray-50 py-16 px-8 md:px-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Resources */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
                Useful Resources
              </p>
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                Quick Access Links
              </h2>
              <ul className="flex flex-col gap-3">
                {RESOURCES.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-xl hover:border-blue-900 hover:bg-blue-50 group transition-all duration-200"
                    >
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors">
                        {label}
                      </span>
                      <FaExternalLinkAlt className="text-xs text-gray-300 group-hover:text-blue-900 transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </section>

        {/* faq section */}
        <section className="py-16 px-8 md:px-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-blue-900 mb-2">
              FAQ
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} {...faq} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
