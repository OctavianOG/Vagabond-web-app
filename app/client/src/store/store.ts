import { SearchParams, UserInterface } from "../libs/types";
import { create } from "zustand";

type Store = {
  authorizedUser: UserInterface | null;
  searchParams: SearchParams | null;
  darkMode: boolean;
  setAuthorizedUser: (user: UserInterface) => void;
  setSearchParams: (params: SearchParams) => void;
  toggleDarkMode: () => void;
};

const useStore = create<Store>((set) => ({
  authorizedUser: null,
  searchParams: null,
  darkMode: true,
  setAuthorizedUser: (user: UserInterface) =>
    set((state) => ({ ...state, authorizedUser: user })),
  setSearchParams: (params: SearchParams) =>
    set((state) => ({ ...state, searchParams: params })),
  toggleDarkMode: () =>
    set((state) => ({ ...state, darkMode: !state.darkMode })),
}));

export default useStore;
