import { useSelector, useDispatch } from "react-redux";
import {
  MessageCircle,
  Send,
  MoreHorizontal,
  Search,
  CheckCheck,
  Flag,
  User as UserIcon,
  ShieldCheck,
  Clock,
  Trash2,
  File,
  Link,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getSupportTicketsList,
  getSupportMessages,
  sendSupportMessage,
  closeSupportTicket,
} from "../helper/api_helper";
const IMAGE_BASE_URL = import.meta.env.VITE_IMG_URL;
const ChatMessage = () => {
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    setFilePreview({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    });
  };

  // ============================
  // GET TICKET LIST
  // ============================
  const fetchTickets = async () => {
    try {
      const res = await getSupportTicketsList({ search });
      if (res.status) {
        setTickets(res.data);

        if (!activeTicketId && res.data.length > 0) {
          setActiveTicketId(res.data[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // GET MESSAGES
  // ============================
  const fetchMessages = async (ticketId) => {
    try {
      const res = await getSupportMessages({ supportId: ticketId });
      if (res.status) {
        setMessages(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // SEND MESSAGE
  // ============================
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      const formData = new FormData();
      formData.append("supportId", activeTicketId);
      formData.append("message", input);
      formData.append("isRepliedByAdmin", true);

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      const res = await sendSupportMessage(formData);

      if (res.status) {
        setInput("");
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchMessages(activeTicketId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // CLOSE TICKET
  // ============================
  const handleCloseTicket = async () => {
    try {
      const res = await closeSupportTicket({
        supportId: activeTicketId,
      });

      if (res.status) {
        fetchTickets();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // LOAD TICKETS
  // ============================
  useEffect(() => {
    fetchTickets();
  }, [search]);

  // ============================
  // LOAD MESSAGES
  // ============================
  useEffect(() => {
    if (activeTicketId) {
      fetchMessages(activeTicketId);
    }
  }, [activeTicketId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="h-[calc(100vh-160px)] flex animate-fadeIn overflow-hidden rounded-[40px] border border-brand-primary/5 shadow-soft bg-white">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
      {/* Sidebar - Ticket List */}
      <div className="w-1/3 border-r border-brand-primary/5 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-brand-primary/5 bg-brand-primary/[0.02]">
          <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight mb-4">
            Support Center
          </h3>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-primary/30" />
            <input
              type="text"
              placeholder="Find tickets..."
              className="pl-10 pr-4 py-2.5 bg-white border border-brand-primary/10 rounded-xl text-xs w-full focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setActiveTicketId(ticket.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all group ${activeTicketId === ticket.id ? "bg-brand-primary text-white shadow-premium" : "hover:bg-brand-primary/5"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4
                  className={`text-sm font-black truncate max-w-[140px] ${activeTicketId === ticket.id ? "text-white" : "text-brand-primary"}`}
                >
                  {ticket.fullName}
                </h4>
                <span
                  className={`text-[8px] font-bold uppercase tracking-widest ${activeTicketId === ticket.id ? "text-white/40" : "text-brand-primary/20"}`}
                >
                  {formatDate(ticket.createdAt)}
                </span>
              </div>
              <p
                className={`text-[10px] font-medium truncate mb-3 ${activeTicketId === ticket.id ? "text-white/60" : "text-brand-primary/40"}`}
              >
                {ticket.subject}
              </p>
              <div className="flex items-center gap-2">
                {/* <span
                  className={`px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest uppercase border ${
                    activeTicketId === ticket.id
                      ? "bg-white/10 text-white border-white/20"
                      : "bg-brand-primary/5 text-brand-primary/60 border-brand-primary/10"
                  }`}
                >
                  {ticket.priority}
                </span> */}
                <span
                  className={`px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest uppercase ${
                    ticket.status === "OPEN"
                      ? activeTicketId === ticket.id
                        ? "bg-white/20 text-white"
                        : "bg-green-100 text-green-700"
                      : activeTicketId === ticket.id
                        ? "bg-brand-accent/20 text-brand-accent"
                        : "bg-brand-primary/10 text-brand-primary/40"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeTicketId ? (
        <div className="flex-1 flex flex-col bg-brand-primary/[0.01]">
          {/* Chat Header */}
          <div className="p-6 border-b border-brand-primary/5 flex items-center justify-between bg-white z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white ring-4 ring-brand-primary/5 shadow-soft overflow-hidden">
                {!activeTicket?.company?.logo ? (
                  <span className="text-lg font-black uppercase">
                    {activeTicket?.company?.companyName?.charAt(0)}
                  </span>
                ) : (
                  <img
                    src={`${IMAGE_BASE_URL}/${activeTicket?.company?.logo}`}
                    alt={activeTicket?.company?.companyName}
                    className="w-10 h-10 object-cover"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-brand-primary">
                    {activeTicket?.fullName}
                  </h3>
                  <div className="px-2 py-0.5 bg-brand-primary/5 rounded-md text-[8px] font-black text-brand-primary/30 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> ID: #
                    {activeTicket?.id}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-[0.1em] mt-0.5">
                  {activeTicket?.company.companyName} • Professional Support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* <button className="p-3 text-brand-primary/30 hover:bg-brand-primary/5 rounded-xl transition-colors">
                <Flag className="w-5 h-5" />
              </button>
              <button className="p-3 text-brand-primary/30 hover:bg-brand-primary/5 rounded-xl transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button> */}
              {activeTicket?.status === "OPEN" ? (
                <button
                  onClick={handleCloseTicket}
                  className="px-6 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-premium ml-2 hover:bg-brand-primary-light transition-all"
                >
                  Close Ticket
                </button>
              ) : (
                <div className="px-6 py-3 bg-brand-primary/5 text-brand-primary/40 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-primary/10 ml-2">
                  Ticket Closed
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col no-scrollbar bg-[radial-gradient(#005A5B10_1px,transparent_1px)] bg-size-[24px_24px]">
            {messages?.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.isRepliedByAdmin ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] p-5 rounded-[28px] ${msg.isRepliedByAdmin ? "bg-brand-primary text-white rounded-tr-none shadow-premium" : "bg-white border border-brand-primary/5 text-brand-primary rounded-tl-none shadow-soft"}`}
                >
                  <p className="text-sm font-medium break-words max-w-100 leading-relaxed">
                    {msg.message}
                  </p>
                  {msg.attachment && (
                    <a
                      href={IMAGE_BASE_URL + "/" + msg.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex bg-brand-primary/5 text-brand-primary p-2 rounded-lg items-center gap-2 mt-2"
                    >
                      <File className="w-5 h-5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        open Attachment
                      </span>
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 px-1">
                  {msg.isRepliedByAdmin && (
                    <CheckCheck className="w-3 h-3 text-brand-accent" />
                  )}
                  <span className="text-[9px] font-bold text-brand-primary/30 uppercase tracking-widest">
                    {/* {msg.customerName} •{" "} */}
                    {new Date(msg.createAt).toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <MessageCircle className="w-16 h-16 mb-4" />
                <p className="text-sm font-black uppercase tracking-widest">
                  No messages found
                </p>
              </div>
            )}
          </div>

          {/* File Preview */}
          {filePreview && (
            <div className="px-6 py-3 bg-brand-primary/5 border-b border-brand-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {filePreview.type.startsWith("image/") ? (
                  <img
                    src={filePreview.url}
                    alt={filePreview.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-brand-primary" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-brand-primary truncate max-w-[200px]">
                    {filePreview.name}
                  </span>
                  <span className="text-[9px] text-brand-primary/40 uppercase tracking-wider">
                    {filePreview.type || "File attached"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="p-2 text-brand-primary/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-brand-primary/5 z-10">
            <div className="flex items-center gap-4 bg-brand-primary/[0.03] p-2 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-primary/5 transition-all border border-transparent focus-within:border-brand-primary/10">
              <input
                type="text"
                placeholder={
                  activeTicket?.status === "OPEN"
                    ? "Type your response to the user..."
                    : "Ticket is closed. Re-open to send message."
                }
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 h-12 text-brand-primary placeholder:text-brand-primary/30 font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={activeTicket?.status !== "OPEN"}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={activeTicket?.status !== "OPEN"}
                className="w-10 h-10 flex items-center justify-center text-brand-primary hover:bg-brand-primary/10 rounded-xl"
              >
                <Link className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={activeTicket?.status !== "OPEN"}
                className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-primary-light transition-all shadow-premium group disabled:opacity-50 disabled:grayscale"
              >
                <Send className="w-5 h-5 text-brand-accent group-hover:scale-110 transition-transform" />
              </button>
            </div>
            {/* <div className="flex items-center gap-4 mt-4 px-2">
                  <span className="text-[9px] font-black text-brand-primary/20 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Quick Actions:
                  </span>
                  <button className="text-[9px] font-black text-brand-primary/40 hover:text-white hover:bg-brand-primary uppercase tracking-widest bg-brand-primary/[0.02] px-3 py-1.5 rounded-lg border border-brand-primary/5 transition-all">
                  Check Subscription
                  </button>
                  <button className="text-[9px] font-black text-brand-primary/40 hover:text-white hover:bg-brand-primary uppercase tracking-widest bg-brand-primary/[0.02] px-3 py-1.5 rounded-lg border border-brand-primary/5 transition-all">
                  Transfer to Tech
                  </button>
              </div> */}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-brand-primary/[0.01]">
          <div className="text-center opacity-30">
            <MessageCircle className="w-24 h-24 mx-auto mb-4" />
            <p className="text-lg font-black uppercase tracking-widest text-brand-primary">
              No Ticket Selected
            </p>
            <p className="text-xs font-medium text-brand-primary/50 mt-2">
              Select a ticket from the list to view messages
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
