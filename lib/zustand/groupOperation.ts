import { create } from "zustand";
import { SimKhast } from "../entities/simKhast";
import { SingleSimCard } from "../entities/singleSimCard";
import { SimPack } from "../entities/simPack";
import { ServiceType } from "../entities/landingPage";

export type GroupOperationType =
  | "discount"
  | "vip"
  | "predict"
  | "activation"
  | "channel"
  | "updateTime"
  | "updatePrice"
  | "installment";

export type GroupOperation = {
  operation?: GroupOperationType;
  serviceType: ServiceType;
  selectedItems: Array<SimKhast | SingleSimCard | SimPack>;
  actions: {
    setServiceType: (serviceType: ServiceType) => void;
    selectGroupOperation: (value?: GroupOperationType) => void;
    selectSingleOperation: (value?: GroupOperationType) => void;
    addItem: (
      item: SimKhast | SingleSimCard | SimPack,
      serviceType: ServiceType,
    ) => void;
    removeItem: (item: SimKhast | SingleSimCard | SimPack) => void;
    flushItems: () => void;
  };
};

const useGroupOperationStore = create<GroupOperation>((set) => ({
  operation: undefined,
  serviceType: "simcard",
  selectedItems: [],
  actions: {
    setServiceType: (serviceType) => set(() => ({ serviceType: serviceType })),
    selectGroupOperation: (value) =>
      set(() => ({ operation: value, selectedItems: [] })),
    selectSingleOperation: (value) => set(() => ({ operation: value })),
    addItem: (item, serviceType) =>
      set((prev) => ({
        serviceType: serviceType,
        selectedItems: [...prev.selectedItems, item],
      })),
    removeItem: (value) =>
      set((prev) => ({
        selectedItems: prev.selectedItems.filter(
          (item) => item._id !== value._id,
        ),
      })),
    flushItems: () =>
      set(() => ({
        selectedItems: [],
        serviceType: "simcard",
        operation: undefined,
      })),
  },
}));

export const useOperation = () =>
  useGroupOperationStore((state) => state.operation);
export const useServiceType = () =>
  useGroupOperationStore((state) => state.serviceType);
export const useSelectedItems = () =>
  useGroupOperationStore((state) => state.selectedItems);
export const useGroupOperationActions = () =>
  useGroupOperationStore((state) => state.actions);
