import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useFeedbackStore = create((set) => ({
    feedbacks: [],
    fetchingFeedbacks: false,
    fetchFeedbacks: async () => {
        set({ fetchingFeedbacks: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching feedbacks"} message="This might take a while..." />));
        try {
            const res =  await axios.get(`${URI}/api/v1/feedback`);
            set({ feedbacks: res.data.data });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Successfully fetched feedbacks."} message={'Review feedbacks carefully!'} />
            ));
        } catch (error) {
            console.log("Error fetching feedbacks:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching feedbacks unsuccessful."} message={'Something went wrong...'} />
            ));
        } finally {
            set({ fetchingFeedbacks: false });
            toast.dismiss(toastId);
        }
    },
    latestFeedback: null,
    fetchingLatesFeedback: false,
    fetchLatestFeedback: async () => {
        set({ fetchingLatesFeedback: true })
        try {
            const res = await axios.get(`${URI}/api/v1/feedback/latest`);
            set({ latestFeedback: res.data.data[0] })
            return res.data;
        } catch (error) {
            console.log("Error fetching latest feedback:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching latest feedback unsuccessful."} message={'Something went wrong...'} />
            ));
        } finally {
            set({ fetchingLatesFeedback: false })
        }
    },
    editingFeedback: false,
    editFeedback: async (userId, guideId, hidden, fromLatestFeedback) => {
        set({ editingFeedback: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Posting guide"} message="This might take a while..." />));
        try {
            const res = await axios.put(`${URI}/api/v1/feedback`, { userId, guideId, hidden });
            if (fromLatestFeedback) {
                set({ latestFeedback: res.data.data });
            } else {
                set((state) => ({
                    feedbacks: state.feedbacks.map((f) => f._id === res.data.data._id ? res.data.data : f)
                }));
            }
            console.log(res.data.data)
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Successfully edited feedback."} message={'Feedback hidden status changed.'} />
            ));
        } catch (error) {
            console.log("Error editing feedback:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching latest feedback unsuccessful."} message={'Something went wrong...'} />
            ));
        } finally {
            set({ editingFeedback: true });
            toast.dismiss(toastId);
        }
    }
}));

export default useFeedbackStore
