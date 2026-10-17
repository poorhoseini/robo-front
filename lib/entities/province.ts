import { ResponseProps } from "./api";

export type Province = {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
};

export interface GetProvincesResponseProps extends ResponseProps {
  data: { provinces: Province[] };
}
