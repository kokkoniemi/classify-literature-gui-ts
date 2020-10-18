import { Publication } from "./publication";

export interface Record {
  id: number;
  title: string;
  PublicationId: number;
  Publication: Publication;
  abstract: string | null;
  author: string;
  comment: string | null;
  url: string;
  alternateUrls: string[];
  databases: string[];
  description: string | null;
  editedBy: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
