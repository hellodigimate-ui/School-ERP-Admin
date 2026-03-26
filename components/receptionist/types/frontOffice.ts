export interface AdmissionEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  class: string;
  source: string;
  description: string;
  followUpDate: string;
  status: "Open" | "Closed" | "Won" | "Lost";
  date: string;
}

export interface VisitorEntry {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  visitingTo: string;
  idProof: string;
  noOfPersons: number;
  inTime: string;
  outTime: string;
  date: string;
  note: string;
}

export interface PhoneCall {
  id: string;
  callerName: string;
  phoneNumber: string;
  callType: "Incoming" | "Outgoing";
  purpose: string;
  createdAt: string;
}

export interface PostalRecord {
  id: string;
  type: "Receive" | "Dispatch";
  fromTitle: string;
  referenceNo: string;
  address: string;
  date: string;
  toTitle: string;
  note: string;
  confidential: boolean;
}

export interface Complaint {
  id: string;
  complaintBy: string;
  phone: string;
  type: string;
  source: string;
  description: string;
  actionTaken: string;
  date: string;
  status: "Pending" | "Resolved" | "In Progress";
  note: string;
}
