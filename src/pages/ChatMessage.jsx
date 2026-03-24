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
  FileText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getSupportTicketsList,
  getSupportMessages,
  sendSupportMessage,
  closeSupportTicket,
} from "../helper/api_helper";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const IMAGE_BASE_URL = import.meta.env.VITE_IMG_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const ChatMessage = () => {
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [allTickets, setAllTickets] = useState([]); // ✅ NEW
  const fileInputRef = useRef(null);
  const activeTicket = allTickets.find((t) => t.id === activeTicketId) || null;
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);

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
      const res = await getSupportTicketsList(); // ❌ remove search
      if (res.status) {
        setTickets(res.data);
        setAllTickets(res.data); // ✅ store original

        if (!activeTicketId && res.data.length > 0) {
          setActiveTicketId(res.data[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTickets = allTickets.filter((ticket) => {
    const searchText = search.toLowerCase();

    return (
      ticket.subject?.toLowerCase().includes(searchText) ||
      ticket.fullName?.toLowerCase().includes(searchText)
    );
  });

  const ticketAttachmentUrl =
    IMAGE_BASE_URL +
      "/" +
      filteredTickets?.find((tik) => tik.id === messages?.[0]?.supportId)
        ?.attachment || null;

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
    if (!input.trim() && !selectedFile) return;

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
        // fetchMessages(activeTicketId);
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(errorMessage);
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
  }, []);

  // ============================
  // LOAD MESSAGES
  // ============================
  useEffect(() => {
    if (activeTicketId) {
      fetchMessages(activeTicketId);
    }
  }, [activeTicketId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    // register admin
    socketRef.current.emit("register_admin");

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeTicketId && socketRef.current) {
      socketRef.current.emit("join_support", activeTicketId);
    }
  }, [activeTicketId]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("new_message", (msg) => {
      if (msg.supportId === activeTicketId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // ✅ FORCE scroll
        setTimeout(() => {
          const el = messagesContainerRef.current;
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }, 50);
      }
    });

    return () => {
      socketRef.current.off("new_message");
    };
  }, [activeTicketId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const el = messagesContainerRef.current;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-[calc(100vh-160px)] flex animate-fadeIn overflow-hidden rounded-[40px] border border-brand-primary/5 shadow-soft bg-white">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf"
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
          {filteredTickets?.length > 0 ? (
            filteredTickets.map((ticket) => (
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
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-brand-primary text-sm font-medium max-w-sm mx-auto mb-10 text-center leading-relaxed">
                No tickets found
              </p>
            </div>
          )}
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
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col no-scrollbar bg-[radial-gradient(#005A5B10_1px,transparent_1px)] bg-size-[24px_24px]"
          >
            {activeTicket?.attachment && ticketAttachmentUrl && (
              <div className="relative flex gap-6 py-6 items-center group max-h-40 w-fit bg-gray-100 p-4 border rounded-xl mx-auto overflow-hidden">
                <div className="flex gap-2 items-center justify-center h-full w-full">
                  <FileText size={24} className="text-brand-primary" />
                  <p className="text-brand-primary text-sm font-bold">
                    {activeTicket?.attachment}
                  </p>
                </div>

                <div className="transition-all duration-300 flex flex-col items-center justify-center gap-4 rounded-xl">
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.open(ticketAttachmentUrl, "_blank")}
                      className="px-4 py-2 text-xs font-bold bg-white text-black rounded-lg hover:bg-gray-200"
                    >
                      View
                    </button>

                    {/* Download Button */}
                    <a
                      href={ticketAttachmentUrl}
                      download={activeTicket?.attachment}
                      className="px-4 py-2 text-xs font-bold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-light"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}
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
                      className={`flex bg-brand-primary/5 text-brand-primary p-2 rounded-lg items-center gap-2 mt-2 ${msg.isRepliedByAdmin ? "bg-white/20 text-white" : "bg-brand-primary/10 text-brand-primary/40"}`}
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
                disabled={activeTicket?.status !== "OPEN" || (!input.trim() && !selectedFile)}
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
