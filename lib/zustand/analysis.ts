import { create } from "zustand";
import { RoundData } from "../entities/round";
import { RoundType } from "../entities/roundType";

export type Analysis = {
  analysisType: "ai" | "expert";
  step: number;
  preNumber: string;
  code: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  digit10: string;
  digit11: string;
  simcardState: string;
  simcardType: string;
  roundData: RoundData | null;
  roundTypesList: RoundType[];
  actions: {
    setAnalysisType: (value: "ai" | "expert") => void;
    setStep: (step: number) => void;
    setPreNumber: (preNumber: string) => void;
    setCode: (value: string) => void;
    setDigit6: (value: string) => void;
    setDigit7: (value: string) => void;
    setDigit8: (value: string) => void;
    setDigit9: (value: string) => void;
    setDigit10: (value: string) => void;
    setDigit11: (value: string) => void;
    setSimcardState: (state: string) => void;
    setSimcardType: (type: string) => void;
    setRoundData: (data: RoundData) => void;
    setRoundTypesList: (data: RoundType[]) => void;
    flush: () => void;
  };
};

const useAnalysisStore = create<Analysis>((set) => ({
  analysisType: "ai",
  step: 1,
  preNumber: "",
  code: "",
  digit6: "",
  digit7: "",
  digit8: "",
  digit9: "",
  digit10: "",
  digit11: "",
  simcardState: "",
  simcardType: "",
  roundData: null,
  roundTypesList: [],
  actions: {
    setAnalysisType: (analysisType) => set(() => ({ analysisType })),
    setStep: (step) => set(() => ({ step })),
    setPreNumber: (preNumber) => set(() => ({ preNumber })),
    setCode: (value) => set(() => ({ code: value })),
    setDigit6: (value) => set(() => ({ digit6: value })),
    setDigit7: (value) => set(() => ({ digit7: value })),
    setDigit8: (value) => set(() => ({ digit8: value })),
    setDigit9: (value) => set(() => ({ digit9: value })),
    setDigit10: (value) => set(() => ({ digit10: value })),
    setDigit11: (value) => set(() => ({ digit11: value })),
    setSimcardState: (simcardState) => set(() => ({ simcardState })),
    setSimcardType: (simcardType) => set(() => ({ simcardType })),
    setRoundData: (roundData) => set(() => ({ roundData })),
    setRoundTypesList: (roundTypesList) => set(() => ({ roundTypesList })),
    flush: () =>
      set(() => ({
        analysisType: "ai",
        step: 1,
        preNumber: "",
        code: "",
        digit6: "",
        digit7: "",
        digit8: "",
        digit9: "",
        digit10: "",
        digit11: "",
        simcardState: "",
        simcardType: "",
        roundData: null,
      })),
  },
}));

export const useAnalysisType = () =>
  useAnalysisStore((state) => state.analysisType);
export const useStep = () => useAnalysisStore((state) => state.step);
export const usePreNumber = () => useAnalysisStore((state) => state.preNumber);
export const useCode = () => useAnalysisStore((state) => state.code);
export const useDigit6 = () => useAnalysisStore((state) => state.digit6);
export const useDigit7 = () => useAnalysisStore((state) => state.digit7);
export const useDigit8 = () => useAnalysisStore((state) => state.digit8);
export const useDigit9 = () => useAnalysisStore((state) => state.digit9);
export const useDigit10 = () => useAnalysisStore((state) => state.digit10);
export const useDigit11 = () => useAnalysisStore((state) => state.digit11);
export const useSimcardState = () =>
  useAnalysisStore((state) => state.simcardState);
export const useSimcardType = () =>
  useAnalysisStore((state) => state.simcardType);
export const useRoundData = () => useAnalysisStore((state) => state.roundData);
export const useRoundTypesList = () =>
  useAnalysisStore((state) => state.roundTypesList);
export const useAnalysisActions = () =>
  useAnalysisStore((state) => state.actions);
