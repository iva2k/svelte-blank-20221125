export type ImageResource = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export type User = {
  uid: string;
  name: string;
  email: string;
  email_verified: boolean;
  roles: string[];
};

export interface Session {
  user: User | null;
}
