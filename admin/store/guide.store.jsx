import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner";

import ToastSuccessful from "../src/components/util/ToastSuccessful.jsx";
import ToastUnsuccessful from "../src/components/util/ToastUnsuccessful";
import ToastPending from "../src/components/util/ToastPending.jsx";

const URI = import.meta.env.VITE_URI;

const useGuideStore = create((set, get) => ({
    guides: [],
    fetchingGuides: false,
    guide: null,
    fetchingGuide: false,
    postingGuide: false,
    deletingGuide: false,
    updatingGuide: false,
    updatingStatus: false,
    postGuide: async (data) => {
        set({ postingGuide: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Posting guide"} message="This might take a while..." />));
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
    updateGuide: async (data, mediaToDelete) => {
        set({ updatingGuide: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating guide"} message="This might take a while..." />));
        try {
            //Check the cover image first.
            if (data.coverImage && typeof data.coverImage === "object" && "name" in data.coverImage) {
                const coverImg = data.coverImage;
                const base64 = await convertToBase64(coverImg);
                const coverImageUpload = await axios.post(`${URI}/api/v1/guideAdmin/media`, { data: base64 });
                data.coverImage = coverImageUpload.data;
            };
            //Check the step medias
            const stepFilesData = [];
            for (const file of data.stepMedias) {
                if (file) {
                    if (typeof file === "object" && "name" in file) {
                        // It's a File object – convert to base64 and upload
                        const base64 = await convertToBase64(file);
                        const res = await axios.post(`${URI}/api/v1/guideAdmin/media`, { data: base64 });
                        stepFilesData.push({
                            ...res.data,
                        });
                    } else {
                        // It's already an object (uploaded media)
                        stepFilesData.push(file);
                    }
                } else {
                    // If null, keep as null
                    stepFilesData.push(null);
                }
            }
            data.stepMedias = stepFilesData;
            //Update the Guide
            const result = await axios.put(`${URI}/api/v1/guideAdmin/guide`, { data });
            toast.custom((t) => (
                <ToastSuccessful dismiss={() => toast.dismiss(t)} title={"Guide Update Successful"} message={result.data.message} />
            ));
            //Delete Medias Changed
            await Promise.all(
                mediaToDelete
                    .filter(media => media) // Skip any nulls
                    .map(media =>
                        axios.delete(`${URI}/api/v1/guideAdmin/media/`, {
                            data: {
                                publicId: media.publicId,
                                url: media.url,
                            },
                        })
                    )
            );
            return result.data.data;
        } catch (error) {
            console.log("Error updating guide:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Guide Update Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ updatingGuide: false });
            toast.dismiss(toastId);
        }
    },
    deleteGuide: async (id, guide) => {
        set({ deletingGuide: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Deleting Guide"} memessage="This might take a while..." />
        ))
        try {
            const result = await axios.delete(`${URI}/api/v1/guideAdmin/guide/${id}`);
            await axios.delete(`${URI}/api/v1/guideAdmin/media/`, { data: { publicId: guide.coverImage.publicId, url: guide.coverImage.url } });
            await Promise.all(
                guide.stepMedias.map(media =>
                    axios.delete(`${URI}/api/v1/guideAdmin/media/`, { data: { publicId: media.publicId, url: media.url } })
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
    fetchGuides: async () => {
        set({ fetchingGuides: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Fetching Guides"} message="This might take a while..." />));
        try {
            const result = await axios.get(`${URI}/api/v1/guideAdmin/guide`);
            set({ guides: result.data.data });
            return true
        } catch (error) {
            console.log("Error fetching guides:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching Guides Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ fetchingGuides: false });
            toast.dismiss(toastId);
        }
    },
    fetchGuide: async (id) => {
        set({ fetchingGuide: true });
        try {
            const res = await axios.get(`${URI}/api/v1/guideAdmin/guide/${id}`);    
            set({ guide: res.data.data });
        } catch (error) {
            console.log("Error fetching guide:", error);
            toast.custom((t) => (
                <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Fetching Guide Unsuccessful"} message={error.response.data.message} />
            ));
            return false;
        } finally {
            set({ fetchingGuide: false });
        }
    },
    getGuideById: (id) => {
        return get().guides.find((g) => g._id === id);
    },
    updateGuideStatus: async (id, status, reason) => {
        set({ updatingStatus: true });
        const toastId = toast.custom((t) => (
            <ToastPending dismiss={() => toast.dismiss(t)} title={"Updating Guide Status"} message="This might take a while..." />));
        try {
            const result = await axios.put(`${URI}/api/v1/guideAdmin/guide/status/${id}`, { status: status, reason: reason });
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
            set({ updatingStatus: false });
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