import { useState } from "react";
import { MessageCircle, Trash2, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useSite } from "../../context/SiteContext";

const mockEnquiries = [
  {
    id: "e1",
    name: "Amaka Okonkwo",
    phone: "08012345678",
    product: "Air Trainer Pro",
    category: "shoes",
    gender: "men",
    message:
      "Hi, I would like to know the price and available sizes for the Air Trainer Pro sneakers.",
    status: "pending",
    date: "2025-01-10",
  },
  {
    id: "e2",
    name: "Tunde Balogun",
    phone: "07098765432",
    product: "Floral Wrap Dress",
    category: "clothing",
    gender: "women",
    message:
      "Please I need the floral wrap dress in size M. Is it available and what is the price?",
    status: "replied",
    date: "2025-01-09",
  },
  {
    id: "e3",
    name: "Chidinma Eze",
    phone: "09011223344",
    product: "Mini Shoulder Bag",
    category: "bags",
    gender: "women",
    message:
      "I saw the mini shoulder bag and I love it. What colours do you have available right now?",
    status: "pending",
    date: "2025-01-08",
  },
  {
    id: "e4",
    name: "Emeka Obi",
    phone: "08033445566",
    product: "Slim Fit Jeans",
    category: "clothing",
    gender: "men",
    message:
      "Do you have the slim fit jeans in size 32? What is the price please?",
    status: "replied",
    date: "2025-01-07",
  },
  {
    id: "e5",
    name: "Ngozi Adeyemi",
    phone: "08055667788",
    product: "Kids Sneakers",
    category: "shoes",
    gender: "kids",
    message:
      "Looking for kids sneakers in EU size 31. Do you have it in pink and white?",
    status: "pending",
    date: "2025-01-06",
  },
];

const EnquiriesManager = () => {
  const { siteSettings } = useSite();
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");

  const statusTabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "replied", label: "Replied" },
  ];

  const filtered =
    activeStatus === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === activeStatus);

  const pending = enquiries.filter((e) => e.status === "pending").length;
  const replied = enquiries.filter((e) => e.status === "replied").length;

  const handleToggleStatus = (id) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: e.status === "pending" ? "replied" : "pending",
            }
          : e
      )
    );
  };

  const handleDelete = (id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
    if (expanded === id) setExpanded(null);
  };

  const handleWhatsApp = (enquiry) => {
    const message = `Hi ${enquiry.name}, thank you for your interest in *${enquiry.product}*. `;
    window.open(
      `https://wa.me/${enquiry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-lg">Enquiries</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {enquiries.length} total · {pending} pending · {replied} replied
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-amber-500 text-2xl font-black">{pending}</p>
            <p className="text-gray-400 text-xs">Pending Replies</p>
          </div>
        </div>
        <div className="bg-white border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <div>
            <p className="text-green-500 text-2xl font-black">{replied}</p>
            <p className="text-gray-400 text-xs">Replied</p>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatus(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-px ${
              activeStatus === tab.id
                ? "border-current"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
            style={
              activeStatus === tab.id
                ? { color: "var(--brand-1)", borderColor: "var(--brand-1)" }
                : {}
            }
          >
            {tab.label}
            {tab.id === "pending" && pending > 0 && (
              <span className="ml-1.5 bg-amber-100 text-amber-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
          <span className="text-4xl mb-3 block">📭</span>
          <p className="text-gray-400 text-sm">No enquiries found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
            >
              {/* Row */}
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                onClick={() =>
                  setExpanded(expanded === enquiry.id ? null : enquiry.id)
                }
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: "var(--brand-1)" }}
                >
                  {enquiry.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-gray-900 text-sm font-semibold">
                      {enquiry.name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        enquiry.status === "pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {enquiry.status === "pending" ? (
                        <Clock size={10} />
                      ) : (
                        <CheckCircle size={10} />
                      )}
                      {enquiry.status.charAt(0).toUpperCase() +
                        enquiry.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">
                    Re: {enquiry.product} · {enquiry.gender} · {enquiry.date}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(enquiry);
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                    aria-label="Reply on WhatsApp"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(enquiry.id);
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                    aria-label="Toggle status"
                    title="Toggle replied/pending"
                  >
                    <CheckCircle size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(enquiry.id);
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                  {expanded === enquiry.id ? (
                    <ChevronUp size={15} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={15} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded */}
              {expanded === enquiry.id && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                    Message
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-5">
                    {enquiry.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                        Phone
                      </p>
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="text-gray-900 text-sm font-semibold hover:underline"
                      >
                        {enquiry.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                        Category
                      </p>
                      <p className="text-gray-900 text-sm font-semibold capitalize">
                        {enquiry.gender} · {enquiry.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleWhatsApp(enquiry)}
                      className="ml-auto inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200"
                    >
                      <MessageCircle size={14} />
                      Reply on WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <span className="text-4xl mb-4 block">🗑️</span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">
              Delete Enquiry?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This enquiry will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-500 hover:text-gray-900 text-sm font-medium py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesManager;