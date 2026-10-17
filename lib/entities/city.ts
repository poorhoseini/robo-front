import { ResponseProps } from "./api";

export type City = {
  id: number;
  name: string;
  provinceId: number;
  slug: string;
};

export interface GetCitiesResponseProps extends ResponseProps {
  data: { cities: City[] };
}

export type GetCitiesRequestProps = {
  provinceId: number;
};
