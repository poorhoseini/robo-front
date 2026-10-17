import { create } from "zustand";
import { City } from "../entities/city";
import { Province } from "../entities/province";

export type AddSimKhastProps = {
  step: number;
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  type: string;
  status: string;
  operator: string;
  province: Province | null;
  city: City | null;
  citiesList: City[];
  roundTypeIds: string[];
  minPrice: string;
  maxPrice: string;
  actions: {
    setStep: (value: number) => void;
    stepBack: () => void;
    setDigit1: (value: string) => void;
    setDigit2: (value: string) => void;
    setDigit3: (value: string) => void;
    setDigit4: (value: string) => void;
    setDigit5: (value: string) => void;
    setDigit6: (value: string) => void;
    setDigit7: (value: string) => void;
    setDigit8: (value: string) => void;
    setDigit9: (value: string) => void;
    setType: (value: string) => void;
    setStatus: (value: string) => void;
    setOperator: (value: string) => void;
    setProvince: (value: Province | null) => void;
    setCity: (value: City | null) => void;
    setCitiesList: (value: City[]) => void;
    setRoundTypeIds: (value: string[]) => void;
    setMinPrice: (value: string) => void;
    setMaxPrice: (value: string) => void;
    flush: () => void;
    reset: () => void;
  };
};

const useAddSimKhastStore = create<AddSimKhastProps>((set) => ({
  step: 1,
  digit1: "",
  digit2: "",
  digit3: "",
  digit4: "",
  digit5: "",
  digit6: "",
  digit7: "",
  digit8: "",
  digit9: "",
  type: "",
  status: "",
  operator: "",
  province: null,
  city: null,
  citiesList: [],
  roundTypeIds: [],
  minPrice: "",
  maxPrice: "",
  actions: {
    setStep: (step) => set(() => ({ step })),
    stepBack: () =>
      set((state) => ({ step: state.step < 2 ? 1 : state.step - 1 })),
    setDigit1: (digit1) => set(() => ({ digit1 })),
    setDigit2: (digit2) => set(() => ({ digit2 })),
    setDigit3: (digit3) => set(() => ({ digit3 })),
    setDigit4: (digit4) => set(() => ({ digit4 })),
    setDigit5: (digit5) => set(() => ({ digit5 })),
    setDigit6: (digit6) => set(() => ({ digit6 })),
    setDigit7: (digit7) => set(() => ({ digit7 })),
    setDigit8: (digit8) => set(() => ({ digit8 })),
    setDigit9: (digit9) => set(() => ({ digit9 })),
    setType: (type) => set(() => ({ type })),
    setStatus: (status) => set(() => ({ status })),
    setOperator: (operator) => set(() => ({ operator })),
    setProvince: (province) => set(() => ({ province })),
    setCity: (city) => set(() => ({ city })),
    setCitiesList: (citiesList) => set(() => ({ citiesList })),
    setRoundTypeIds: (roundTypeIds) => set(() => ({ roundTypeIds })),
    setMinPrice: (minPrice) => set(() => ({ minPrice })),
    setMaxPrice: (maxPrice) => set(() => ({ maxPrice })),
    flush: () =>
      set(() => ({
        // step: 1,
        digit1: "",
        digit2: "",
        digit3: "",
        digit4: "",
        digit5: "",
        digit6: "",
        digit7: "",
        digit8: "",
        digit9: "",
        type: "",
        status: "",
        operator: "",
        province: null,
        city: null,
        citiesList: [],
        roundTypeIds: [],
        minPrice: "",
        maxPrice: "",
      })),
    reset: () =>
      set(() => ({
        step: 1,
        digit1: "",
        digit2: "",
        digit3: "",
        digit4: "",
        digit5: "",
        digit6: "",
        digit7: "",
        digit8: "",
        digit9: "",
        type: "",
        status: "",
        operator: "",
        province: null,
        city: null,
        citiesList: [],
        roundTypeIds: [],
        minPrice: "",
        maxPrice: "",
      })),
  },
}));

export const useStep = () => useAddSimKhastStore((state) => state.step);
export const useDigit1 = () => useAddSimKhastStore((state) => state.digit1);
export const useDigit2 = () => useAddSimKhastStore((state) => state.digit2);
export const useDigit3 = () => useAddSimKhastStore((state) => state.digit3);
export const useDigit4 = () => useAddSimKhastStore((state) => state.digit4);
export const useDigit5 = () => useAddSimKhastStore((state) => state.digit5);
export const useDigit6 = () => useAddSimKhastStore((state) => state.digit6);
export const useDigit7 = () => useAddSimKhastStore((state) => state.digit7);
export const useDigit8 = () => useAddSimKhastStore((state) => state.digit8);
export const useDigit9 = () => useAddSimKhastStore((state) => state.digit9);
export const useType = () => useAddSimKhastStore((state) => state.type);
export const useStatus = () => useAddSimKhastStore((state) => state.status);
export const useOperator = () => useAddSimKhastStore((state) => state.operator);
export const useProvince = () => useAddSimKhastStore((state) => state.province);
export const useCity = () => useAddSimKhastStore((state) => state.city);
export const useCitiesList = () =>
  useAddSimKhastStore((state) => state.citiesList);
export const useRoundTypeIds = () =>
  useAddSimKhastStore((state) => state.roundTypeIds);
export const useMinPrice = () => useAddSimKhastStore((state) => state.minPrice);
export const useMaxPrice = () => useAddSimKhastStore((state) => state.maxPrice);
export const useAddSimKhastActions = () =>
  useAddSimKhastStore((state) => state.actions);
