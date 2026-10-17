import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type BookmarkRefrence = ServiceType;

export type Bookmark = {
  isBookmark: boolean;
};

export interface GetBookmarkStateResponseProps extends ResponseProps {
  data: Bookmark;
}

export type GetBookmarkStateRequestProps = {
  refrence: BookmarkRefrence;
  refrenceId: string;
};

export interface ChangeBookmarkStateResponseProps extends ResponseProps {
  data: {};
}

export type ChangeBookmarkStateRequestProps = {
  refrence: BookmarkRefrence;
  refrenceId: string;
  isActive: boolean;
};
