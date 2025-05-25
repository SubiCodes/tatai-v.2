// stores/userStore.js
import { create } from "zustand";
import axios from "axios";

import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastSuccessful from "../src/components/util/ToastSuccessful";
import { toast } from "sonner";

const useUserStore = create((set) => ({
  adminData: null,
  fetchingAdminData: false,
  users: [],
  addingUser: false,

  getAdminData: async () => {
    set({ fetchingAdminData: true });
    try {
      const response = await axios.get(`${import.meta.env.VITE_URI}/api/v1/userAdmin/admin`, {
        withCredentials: true,
      });
      set({
        adminData: response.data.data,
        fetchingAdminData: false,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.custom((t) => (
        <ToastUnsuccessful
          dismiss={() => toast.dismiss(t)}
          title={"Error Fetching Admin Data"}
          message={error.response?.data?.message || error.message}
        />
      ));
      set({ fetchingAdminData: false });
    }
  },

  addUser: async (userData) => {
    set({ addingUser: true});
    try {
      const result = await axios.post(`${import.meta.env.VITE_URI}/api/v1/userAdmin/user`,  userData );
      toast.custom((t) => (
        <ToastSuccessful
            dismiss={() => toast.dismiss(t)}
            title={"Account created"}
            message={`User ${userData.email} has been successfully created.`}
        />
        ));

      set((state) => ({
        users: [...state.users, result.data],
        addingUser: false,
      }));
      return true;
    } catch (err) {
        console.error("Error adding user:", err);
        toast.custom((t) => (
          <ToastUnsuccessful
            dismiss={() => toast.dismiss(t)}
            title={"Unsuccessful User Creation"}
            message={err.response?.data?.message || err.message}
          />
        ));
      set({
        addingUser: false,
      });
      return false;
    }
  },
}));

export default useUserStore;
