import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useGuideStore = create((set) => ({
    guides: [],
    fetchingGuides: false,
    postingGuide: false,
    postGuide: async (data) => {
        set({ postingGuide: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating password"} message="This might take a while..." />));
        try {
            const coverImg = data.coverImage;
            const base64 = await convertToBase64(coverImg);
            const coverImageUpload = await axios.post(`${URI}/api/v1/guideAdmin/media`, { data: base64 });
            data.coverImage = coverImageUpload.data;

            const stepFilesData = [];
            for (const file of data.stepMedias) {
                if (file) {
                    const base64 = await convertToBase64(file);
                    const res = await axios.post(`${URI}/api/v1/guideAdmin/media`, { data: base64 });
                    stepFilesData.push({
                        ...res.data,
                    });
                } else {
                    stepFilesData.push(null);
                }
            };
            data.stepMedias = stepFilesData;

            const res = await axios.post(`${URI}/api/v1/guideAdmin/guide`, { data });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Guide Posting Successful"} message={res.data.message} />
            ));
            return true;
        } catch (error) {
            console.log("Error posting guide:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Guide Posting Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ postingGuide: false });
            toast.dismiss(toastId);
        }
    },
    fetchGuides: async () => {
        set({ fetchingGuides: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching Guides"} message="This might take a while..." />));
        try {
            const result = await axios.get(`${URI}/api/v1/guideAdmin/guide`);
            set({guides: result.data.data});
            console.log(result.data.data);
            return true
        } catch (error) {
            console.log("Error posting guide:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching Guides Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
           set({ fetchingGuides: false });
           toast.dismiss(toastId);
        }
    }
}));

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export default useGuideStore;