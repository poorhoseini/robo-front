import { create } from "zustand";
import { City } from "../entities/city";
import { InstallmentPlan } from "../entities/installment";
import { Province } from "../entities/province";

export type SimPackSavedItem = {
  phoneNumber: string;
  type: string;
  status: string;
};

export type AddSimPackProps = {
  step: number;
  savedItems: SimPackSavedItem[];
  digits: string;
  type: string;
  status: string;
  province: Province | null;
  city: City | null;
  citiesList: City[];
  simPackType: string;
  priceType: string;
  price: string;
  hasInstallmentPlan: boolean;
  loanId: string;
  myInstallmentPlans: InstallmentPlan[];
  actions: {
    setStep: (value: number) => void;
    stepBack: () => void;
    setSavedItems: (value: SimPackSavedItem[]) => void;
    setDigits: (value: string) => void;
    setType: (value: string) => void;
    setStatus: (value: string) => void;
    setProvince: (value: Province | null) => void;
    setCity: (value: City | null) => void;
    setCitiesList: (value: City[]) => void;
    setSimPackType: (value: string) => void;
    setPriceType: (value: string) => void;
    setPrice: (value: string) => void;
    setHasInstallmentPlan: (value: boolean) => void;
    setLoanId: (value: string) => void;
    setMyInstallmentPlans: (value: InstallmentPlan[]) => void;
    saveCurrentItem: () => void;
    removeSavedItem: (index: number) => void;
    flush: () => void;
    reset: () => void;
  };
};

const useAddSimPackStore = create<AddSimPackProps>((set) => ({
  step: 1,
  savedItems: [],
  digits: "",
  type: "",
  status: "",
  province: null,
  city: null,
  citiesList: [],
  simPackType: "",
  priceType: "",
  price: "",
  hasInstallmentPlan: false,
  loanId: "",
  myInstallmentPlans: [],
  actions: {
    setStep: (step) => set(() => ({ step })),
    stepBack: () =>
      set((state) => ({ step: state.step < 2 ? 1 : state.step - 1 })),
    setSavedItems: (savedItems) => set(() => ({ savedItems })),
    setDigits: (digits) => set(() => ({ digits })),
    setType: (type) => set(() => ({ type })),
    setStatus: (status) => set(() => ({ status })),
    setProvince: (province) => set(() => ({ province })),
    setCity: (city) => set(() => ({ city })),
    setCitiesList: (citiesList) => set(() => ({ citiesList })),
    setSimPackType: (simPackType) => set(() => ({ simPackType })),
    setPriceType: (priceType) => set(() => ({ priceType })),
    setPrice: (price) => set(() => ({ price })),
    setHasInstallmentPlan: (hasInstallmentPlan) =>
      set(() => ({ hasInstallmentPlan })),
    setLoanId: (loanId) => set(() => ({ loanId })),
    setMyInstallmentPlans: (myInstallmentPlans) =>
      set(() => ({ myInstallmentPlans })),
    saveCurrentItem: () =>
      set((prev) => ({
        savedItems: [
          ...prev.savedItems,
          {
            phoneNumber: "09" + prev.digits,
            type: prev.type,
            status: prev.status,
          },
        ],
      })),
    removeSavedItem: (indexToRemove) =>
      set((prev) => ({
        ...prev,
        savedItems: prev.savedItems.filter(
          (item, index) => index !== indexToRemove,
        ),
      })),
    flush: () =>
      set(() => ({
        // step: 1,
        // savedItems: [],
        digits: "",
        type: "",
        status: "",
        // province: null,
        // city: null,
        // citiesList: [],
        // simPackType: "",
        // priceType: "",
        // price: "",
        // hasInstallmentPlan: false,
        // loanId: "",
        // myInstallmentPlans: [],
      })),
    reset: () =>
      set(() => ({
        step: 1,
        savedItems: [],
        digits: "",
        type: "",
        status: "",
        province: null,
        city: null,
        citiesList: [],
        simPackType: "",
        priceType: "",
        price: "",
        hasInstallmentPlan: false,
        loanId: "",
        myInstallmentPlans: [],
      })),
  },
}));

export const useStep = () => useAddSimPackStore((state) => state.step);
export const useSavedItems = () =>
  useAddSimPackStore((state) => state.savedItems);
export const useDigits = () => useAddSimPackStore((state) => state.digits);
export const useType = () => useAddSimPackStore((state) => state.type);
export const useStatus = () => useAddSimPackStore((state) => state.status);
export const useProvince = () => useAddSimPackStore((state) => state.province);
export const useCity = () => useAddSimPackStore((state) => state.city);
export const useCitiesList = () =>
  useAddSimPackStore((state) => state.citiesList);
export const useSimPackType = () =>
  useAddSimPackStore((state) => state.simPackType);
export const usePriceType = () =>
  useAddSimPackStore((state) => state.priceType);
export const usePrice = () => useAddSimPackStore((state) => state.price);
export const useHasInstallmentPlan = () =>
  useAddSimPackStore((state) => state.hasInstallmentPlan);
export const useLoanId = () => useAddSimPackStore((state) => state.loanId);
export const useMyInstallmentPlans = () =>
  useAddSimPackStore((state) => state.myInstallmentPlans);
export const useAddSimPackActions = () =>
  useAddSimPackStore((state) => state.actions);
