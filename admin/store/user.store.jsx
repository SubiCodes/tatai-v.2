// stores/userStore.js
import { create } from "zustand";
import axios from "axios";

import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastSuccessful from "../src/components/util/ToastSuccessful";
import ToastPending from "../src/components/util/ToastPending";
import { toast } from "sonner";

const useUserStore = create((set) => ({
  adminData: null,
  fetchingAdminData: false,
  users: [],
  addingUser: false,
  fetchingUsers: false,

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
    const toastId = toast.custom((t) => (
      <ToastPending
        dismiss={() => toast.dismiss(t)}
        title={"Adding User"}
        message="This might take a while..."
      />
    ));
    set({ addingUser: true });
    try {
      const result = await axios.post(`${import.meta.env.VITE_URI}/api/v1/userAdmin/user`, userData);
      toast.custom((t) => (
        <ToastSuccessful
          dismiss={() => toast.dismiss(t)}
          title={"Account created"}
          message={`User ${userData.email} has been successfully created.`}
        />
      ));

      set((state) => ({
        users: [...state.users, result.data.data],
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
    } finally {
      toast.dismiss(toastId);
    }
  },
  fetchUsers: async () => {
    try {
      set({ fetchingUsers: true });
      const response = await axios.get(`${import.meta.env.VITE_URI}/api/v1/userAdmin/user`, {
        withCredentials: true,
      });
      set({
        users: response.data.data,
        fetchingUsers: false,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast.custom((t) => (
        <ToastUnsuccessful
          dismiss={() => toast.dismiss(t)}
          title={"Cant Fetch Users"}
          message={error.response?.data?.message || error.message}
        />
      ));
      set({
        addingUser: false,
      });
      return false;
    } finally {
      set({ fetchingUsers: false });
    }
  },
  updateUserStatus: async (id, status, oldUsers) => {
    const toastId = toast.custom((t) => (
      <ToastPending
        dismiss={() => toast.dismiss(t)}
        title={"Updating status"}
        message="This might take a while..."
      />
    ));

    try {
      const res = await axios.post(`${import.meta.env.VITE_URI}/api/v1/userAdmin/status/${id}`, { status });
      const updatedUser = res.data.data;
      const updatedUsers = oldUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
      set({ users: updatedUsers });

      toast.custom((t) => (
        <ToastSuccessful
          dismiss={() => toast.dismiss(t)}
          title={"Status Updated"}
          message={`User ${updatedUser?.email} status updated successfully.`}
        />
      ));
    } catch (error) {
      console.error("Error changing status:", error);
      toast.custom((t) => (
        <ToastUnsuccessful
          dismiss={() => toast.dismiss(t)}
          title={"Cannot change status"}
          message={error.response?.data?.message || error.message}
        />
      ));
    } finally {
      toast.dismiss(toastId); // ✅ Force close pending toast
    }
  }
}));

export default useUserStore;
