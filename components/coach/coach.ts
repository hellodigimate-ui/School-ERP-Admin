export interface Sport {
  id: string;
  name: string;
  category: string;
  maxPlayers: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface StudentEnrollment {
  id: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  sportId: string;
  sportName: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended';
  parentContact: string;
  healthNotes: string;
}

export interface Schedule {
  id: string;
  sportId: string;
  sportName: string;
  day: string;
  startTime: string;
  endTime: string;
  venue: string;
  coachName: string;
  notes: string;
}

export interface Tournament {
  id: string;
  name: string;
  sportId: string;
  sportName: string;
  startDate: string;
  endDate: string;
  venue: string;
  level: 'school' | 'district' | 'state' | 'national' | 'international';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description: string;
  participants: number;
}

export interface Achievement {
  id: string;
  studentName: string;
  sportName: string;
  tournamentName: string;
  position: string;
  date: string;
  description: string;
  certificateUrl?: string;
}

export interface Equipment {
  id: string;
  name: string;
  sportId: string;
  sportName: string;
  quantity: number;
  condition: 'new' | 'good' | 'fair' | 'poor';
  purchaseDate: string;
  notes: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  sportName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}
