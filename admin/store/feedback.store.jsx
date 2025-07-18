import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useFeedbackStore = create((set) => ({
    latestFeedback: null,
    fetchingLatesFeedback: false,
    fetchLatestFeedback: async () => {
        set({ fetchingLatesFeedback: true })
        try {
            const res = await axios.get(`${URI}/api/v1/guideAdmin/feedback/latest`);
            return res.data;
        } catch (error) {
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Fetching latest feedback unsuccessful."} message={error.message} />
            ));
        } finally {
            set({ fetchingLatesFeedback: false })
        }
    }
}));

export default useFeedbackStore
