export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Room {
  id: number;
  roomName: string;
  createdBy: number;
  scheduledFor: string;
  created: string;
}

export interface Participant {
  account: User;
  created: string;
  id: number;
  roomId: number;
}
