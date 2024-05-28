export interface UserData {
  name: string;
  avatarUrl: string;
}

interface Article {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  date: string;
  imgUrl: string;
}

export interface dialogProps {
  title: string;
  subtitle: string;
  submitText: string;
  cancelText: string;
  onSubmit: (e: any) => Promise<void>;
  onCancel: () => void;
  onClose: () => void;
  isLoading: boolean;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export interface Headline {
  title: string;
  urlToImage: string;
  description: string;
  author: string;
  publishedAt: string;
  content: string;
  url: string;
}

export type TProduct = {
  id: number;
  imgUrl: string;
  name: string;
  title: string;
  category: string;
  description: string;
  price: number;
  color: string;
  colors: string[];
};

export type AuthorType = {
  id: number;
  name: string;
  imgUrl: string;
};
