export interface Publication {
  id: number;
  jufoLevel: number | null;
  name: string;
  poorPeerReview: boolean | null;
  updatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  database: string | null;
  alternateNames: string[] | null;
}
