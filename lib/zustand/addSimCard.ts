import { create } from "zustand";
import { City } from "../entities/city";
import { InstallmentPlan } from "../entities/installment";
import { RoundData } from "../entities/round";
import { Province } from "../entities/province";

export type SimcardSavedItem = {
  phoneNumber: string;
  type: string;
  status: string;
  province: Province | null;
  city: City | null;
  roundData: RoundData | undefined;
  priceType: string;
  price: string;
  hasInstallmentPlan: boolean;
  loanId: string;
};

export type AddSimcardProps = {
  step: number;
  savedItems: SimcardSavedItem[];
  digits: string;
  type: string;
  status: string;
  province: Province | null;
  city: City | null;
  citiesList: City[];
  roundData: RoundData | undefined;
  priceType: string;
  price: string;
  hasInstallmentPlan: boolean;
  loanId: string;
  myInstallmentPlans: InstallmentPlan[];
  actions: {
    setStep: (value: number) => void;
    stepBack: () => void;
    setSavedItems: (value: SimcardSavedItem[]) => void;
    setDigits: (value: string) => void;
    setType: (value: string) => void;
    setStatus: (value: string) => void;
    setProvince: (value: Province | null) => void;
    setCity: (value: City | null) => void;
    setCitiesList: (value: City[]) => void;
    setRoundData: (value: RoundData | undefined) => void;
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

const useAddSimcardStore = create<AddSimcardProps>((set) => ({
  step: 1,
  savedItems: [],
  digits: "",
  type: "",
  status: "",
  province: null,
  city: null,
  citiesList: [],
  roundData: undefined,
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
    setRoundData: (roundData) => set(() => ({ roundData })),
    setPriceType: (priceType) => set(() => ({ priceType })),
    setPrice: (price) => set(() => ({ price })),
    setHasInstallmentPlan: (hasInstallmentPlan) =>
      set(() => ({ hasInstallmentPlan })),
    setLoanId: (loanId) =>
      set(() => ({ loanId, hasInstallmentPlan: !!loanId })),
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
            province: prev.province,
            city: prev.city,
            roundData: prev.roundData,
            priceType: prev.priceType,
            price: prev.price,
            hasInstallmentPlan: prev.hasInstallmentPlan,
            loanId: prev.loanId,
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
        province: null,
        city: null,
        citiesList: [],
        roundData: undefined,
        priceType: "",
        price: "",
        hasInstallmentPlan: false,
        loanId: "",
        myInstallmentPlans: [],
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
        roundData: undefined,
        priceType: "",
        price: "",
        hasInstallmentPlan: false,
        loanId: "",
        myInstallmentPlans: [],
      })),
  },
}));

export const useStep = () => useAddSimcardStore((state) => state.step);
export const useSavedItems = () =>
  useAddSimcardStore((state) => state.savedItems);
export const useDigits = () => useAddSimcardStore((state) => state.digits);
export const useType = () => useAddSimcardStore((state) => state.type);
export const useStatus = () => useAddSimcardStore((state) => state.status);
export const useProvince = () => useAddSimcardStore((state) => state.province);
export const useCity = () => useAddSimcardStore((state) => state.city);
export const useCitiesList = () =>
  useAddSimcardStore((state) => state.citiesList);
export const useRoundData = () =>
  useAddSimcardStore((state) => state.roundData);
export const usePriceType = () =>
  useAddSimcardStore((state) => state.priceType);
export const usePrice = () => useAddSimcardStore((state) => state.price);
export const useHasInstallmentPlan = () =>
  useAddSimcardStore((state) => state.hasInstallmentPlan);
export const useLoanId = () => useAddSimcardStore((state) => state.loanId);
export const useMyInstallmentPlans = () =>
  useAddSimcardStore((state) => state.myInstallmentPlans);
export const useAddSimcardActions = () =>
  useAddSimcardStore((state) => state.actions);
