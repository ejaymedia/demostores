import { useState } from "react";
import { MessageCircle, Trash2, CheckCircle, Clock } from "lucide-react";

const mockEnquiries = [
  {
    id: "e1",
    name: "Amaka Okonkwo",
    phone: "08012345678",
    product: "Air Trainer Pro",
    category: "sneakers",
    message: "Hi, I would like to know the price and available sizes for the Air Trainer Pro sneakers.",
    status: "pending",
    date: "2025-01-10",
  },
  {
    id: "e2",
    name: "Tunde Balogun",
    phone: "07098765432",
    product: "Denim Bedding Set",
    category: "beddings",
    message: "Please I need the king size denim bedding set. Is it available and how much?",
    status: "replied",
    date: "2025-01-09",
  },
  {
    id: "e3",
    name: "Chidinma Eze",
    phone: "09011223344",
    product: "LV Shoulder Bag",
    category: "bags",
    message: "I saw the LV shoulder bag and I love it. What colours do you have available right now?",
    status: "pending",
    date: "2025-01-08",
  },
  {
    id: "e4",
    name: "Emeka Obi",
    phone: "08033445566",
    product: "GG Tracksuit",
    category: "wears",
    message: "Do you have the GG Tracksuit in XL? What is the price please?",
    status: "replied",
    date: "2025-01-07",
  },
];

const statusStyles = {
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  replied: "bg-green-500/15 text-green-400 border border-green-500/30",
};

const statusIcons = {
  pending: <Clock size={12} />,
  replied: <CheckCircle size={12} />,
};

const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleToggleStatus = (id) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "pending" ? "replied" : "pending" }
          : e
      )
    );
  };

  const handleDelete = (id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  const handleWhatsApp = (enquiry) => {
    const message = `Hi ${enquiry.name}, thank you for your interest in *${enquiry.product}*. `;
    window.open(
      `https://wa.me/${enquiry.phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const pending = enquiries.filter((e) => e.status === "pending").length;
  const replied = enquiries.filter((e) => e.status === "replied").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-lg">Enquiries</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {enquiries.length} total · {pending} pending · {replied} replied
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1A1A2E] border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Clock size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-amber-400 text-2xl font-black">{pending}</p>
            <p className="text-gray-500 text-xs">Pending Replies</p>
          </div>
        </div>
        <div className="bg-[#1A1A2E] border border-green-500/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-400" />
          </div>
          <div>
            <p className="text-green-400 text-2xl font-black">{replied}</p>
            <p className="text-gray-500 text-xs">Replied</p>
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      {enquiries.length === 0 ? (
        <div className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl py-16 text-center">
          <span className="text-4xl mb-3 block">📭</span>
          <p className="text-gray-400 text-sm">No enquiries yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl overflow-hidden"
            >
              {/* Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors duration-150"
                onClick={() =>
                  setExpanded(expanded === enquiry.id ? null : enquiry.id)
                }
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-purple-900/30 border border-purple-700/30 flex items-center justify-center shrink-0">
                  <span className="text-purple-300 text-sm font-bold">
                    {enquiry.name.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-semibold">
                      {enquiry.name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        statusStyles[enquiry.status]
                      }`}
                    >
                      {statusIcons[enquiry.status]}
                      {enquiry.status.charAt(0).toUpperCase() +
                        enquiry.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">
                    Re: {enquiry.product} · {enquiry.date}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(enquiry);
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition-colors duration-200"
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
                    className="p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors duration-200"
                    aria-label="Toggle status"
                    title="Toggle status"
                  >
                    <CheckCircle size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(enquiry.id);
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    aria-label="Delete enquiry"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded Message */}
              {expanded === enquiry.id && (
                <div className="px-5 pb-5 border-t border-purple-900/10 pt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
                    Message
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {enquiry.message}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wider mb-0.5">
                        Phone
                      </p>
                      <p className="text-white text-sm font-medium">
                        {enquiry.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase tracking-wider mb-0.5">
                        Category
                      </p>
                      <p className="text-white text-sm font-medium capitalize">
                        {enquiry.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleWhatsApp(enquiry)}
                      className="ml-auto inline-flex items-center gap-2 bg-green-700/20 hover:bg-green-700/30 border border-green-600/30 text-green-400 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-[#1A1A2E] border border-red-500/20 rounded-2xl p-8 w-full max-w-sm text-center">
            <span className="text-4xl mb-4 block">🗑️</span>
            <h3 className="text-white font-bold text-lg mb-2">
              Delete Enquiry?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This enquiry will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white text-sm font-medium py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200"
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