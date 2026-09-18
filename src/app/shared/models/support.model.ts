export type SupportView = 'list' | 'new' | 'chat';

export interface SupportTicket {
    id: number;
    subject: string;
    status: 'OPEN' | 'CLOSED';
    createdAt: string ;
    closedAt: string | null;
  }
  
  export interface SupportMessage {
    id: number;
    ticketId: number;
    senderId: number;
    senderName: string;
    senderType: 'CLIENT' | 'SUPPORT';
    content: string;
    fileUrl: string | null;
    sentAt: string;
  }
  
  export interface TicketListResponse {
    content: SupportTicket[];
    totalElements: number;
    totalPages: number;
  }