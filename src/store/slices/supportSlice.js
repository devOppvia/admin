import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tickets: [
        {
            id: 1,
            fullName: 'John Doe',
            company: { name: 'TechCorp Solutions', logo: 'techcorp.png' },
            subject: 'Billing Issue - Double Charge',
            priority: 'HIGH',
            status: 'OPEN',
            createdAt: '2026-02-28T10:30:00Z'
        },
        {
            id: 2,
            fullName: 'Jane Smith',
            company: { name: 'EcoGen Dynamics', logo: 'ecogen.png' },
            subject: 'Technical Help - API Integration',
            priority: 'MEDIUM',
            status: 'CLOSED',
            createdAt: '2026-02-21T14:20:00Z'
        },
    ],
    messages: {
        1: [
            { id: 1, sender: 'John Doe', content: 'We were charged twice for this month subscription.', time: '10:30 AM', isRepliedByAdmin: false },
            { id: 2, sender: 'Oppvia Admin', content: 'We are investigating this with the billing department. Please hold on.', time: '10:45 AM', isRepliedByAdmin: true },
        ],
    },
    inquiries: [
        {
            id: 1,
            fullName: 'Alice Johnson',
            email: 'alice@example.com',
            country: 'United Kingdom',
            phoneNumber: '+44 7700 900077',
            reason: 'Partnership Inquiry',
            message: 'I am interested in exploring partnership opportunities with Oppvia.',
            createdAt: '2026-02-25T11:15:00Z'
        },
        {
            id: 2,
            fullName: 'Bob Brown',
            email: 'bob@example.com',
            country: 'USA',
            phoneNumber: '+1 555 123 4567',
            reason: 'General Question',
            message: 'Can you provide more information about the enterprise plan?',
            createdAt: '2026-02-26T09:40:00Z'
        }
    ],
    loading: false,
    error: null,
};

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        closeTicket: (state, action) => {
            const ticket = state.tickets.find(t => t.id === action.payload);
            if (ticket) {
                ticket.status = 'CLOSED';
            }
        },
        addMessage: (state, action) => {
            const { ticketId, message } = action.payload;
            if (!state.messages[ticketId]) {
                state.messages[ticketId] = [];
            }
            state.messages[ticketId].push(message);
        },
        deleteInquiry: (state, action) => {
            state.inquiries = state.inquiries.filter(i => i.id !== action.payload);
        }
    },
});

export const { closeTicket, addMessage, deleteInquiry } = supportSlice.actions;
export default supportSlice.reducer;
