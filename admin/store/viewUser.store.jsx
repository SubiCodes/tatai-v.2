import { create } from "zustand";
import axios from "axios";

import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastSuccessful from "../src/components/util/ToastSuccessful";
import ToastPending from "../src/components/util/ToastPending";
import { toast } from "sonner";

const useViewUserStore = create((set, get) => ({
    guides: [],
    userData: null,
    fetchingUserData: false,
    fetchUserData: async (id) => {
        set({ fetchingUserData: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching user data"} message="This might take a while..." />));
        try {
            const res = await axios.get(`${import.meta.env.VITE_URI}/api/v1/viewUserAdmin/${id}`);
            set({ userData: res.data });
            set({ guides: res.data.guides });
            return res.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"User Data Fetch Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ fetchingUserData: false });
            toast.dismiss(toastId);
        }
    },
    getGuideByIdFromViewUser: (id) => {
        return get().guides.find((g) => g._id === id);
    },
    updateGuideStatusFromViewUser: async (id, status) => {
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating Guide Status"} message="This might take a while..." />));
        try {
            const result = await axios.put(`${import.meta.env.VITE_URI}/api/v1/guideAdmin/guide/status/${id}`, { status: status });
            set((state) => ({ guides: state.guides.map((guide) => guide._id === id ? { ...guide, status } : guide) }));
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Updating guide status Successful"} message={result.data.message} />
            ));
        } catch (error) {
            console.log("Error Updating Guide Status:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Updating Guide Status Unsuccessful"} message={error.response.data.message} />
            ));
        } finally {
            toast.dismiss(toastId);
        }
    },
    deleteGuideFromViewUser: async (id, guide) => {
        set({ deletingGuide: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Deleting Guide"} memessage="This might take a while..." />
        ))
        try {
            const result = await axios.delete(`${import.meta.env.VITE_URI}/api/v1/guideAdmin/guide/${id}`);
            await axios.delete(`${import.meta.env.VITE_URI}/api/v1/guideAdmin/media/`, { data: { publicId: guide.coverImage.publicId, url: guide.coverImage.url } });
            await Promise.all(
                guide.stepMedias.map(media =>
                    axios.delete(`${import.meta.env.VITE_URI}/api/v1/guideAdmin/media/`, { data: { publicId: media.publicId, url: media.url } })
                )
            );
            set((state) => ({
                guides: state.guides.filter((t) => t._id !== id)
            }))
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Guide deletion Successful"} message={result.data.message} />
            ))
            return true;
        } catch (error) {
            console.log("Error deleting guide:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Guide deletion Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ deletingGuide: false });
            toast.dismiss(toastId);
        }
    },
}));

export default useViewUserStore;