export interface Feed {
  id: number;
  link: string;
  created_at: string;
}

export interface CreateFeedDto {
  link: string;
}
