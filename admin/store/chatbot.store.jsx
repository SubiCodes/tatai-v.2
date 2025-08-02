import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useChatbotStore = create((set) => ({
    embeddingData: false,
    embedData: async () => {
        set({ embeddingData: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Uploading Data to TatAi Chatbot"} message="This might take a while..." />));
        try {
            const res = await axios.post(`${URI}/api/v1/chatbot/data`);
            console.log(res.data);
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Upload Successful!"} message={res.data.message} />
            ));
        } catch (error) {
            console.log("Error uploading data:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Uploading Data to TatAi Chatbot Failed"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ embeddingData: false });
            toast.dismiss(toastId);
        }
    }
}));

export default useChatbotStore;

