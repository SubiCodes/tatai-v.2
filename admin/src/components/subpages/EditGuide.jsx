import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';
import { House, Hammer, Sofa, Image, Info } from 'lucide-react';
import { DotLoader } from 'react-spinners'
import ToastUnsuccessful from '../util/ToastUnsuccessful.jsx';
import { PulseLoader } from 'react-spinners';


import useGuideStore from '../../../store/guide.store.jsx';
import { useState, useRef } from 'react';

function EditGuide() {
    const { id } = useParams();

    const { fetchGuide, fetchingGuide, guide, updateGuide, updatingGuide } = useGuideStore();

    const [editedGuide, setEditedGuide] = useState(null);
    const [mediaToDelete, setMediaToDelete] = useState([]);

    const toolInputRef = useRef(null);

    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [toolsError, setToolsError] = useState(false);
    const [materialsError, setMaterialsError] = useState(false);
    const [stepTitlesErrors, setStepTitlesErrors] = useState([]);
    const [stepDescriptionsErrors, setStepDescriptionsErrors] = useState([]);
    const [stepMediasErrors, setStepMediasErrors] = useState([]);
    const [closingMessageErrors, setClosingMessageErrors] = useState(false);

    const [imageDisplay, setImageDisplay] = useState(false);
    const [display, setDisplay] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const handleCoverImageChange = (e, media) => {
        const file = e.target.files[0];
        if (file) {
            setMediaToDelete([...mediaToDelete, media])
            setEditedGuide({ ...editedGuide, coverImage: file });
        }
    };

    const handleProcedureMediaChange = (e, index, media) => {
        const file = e.target.files[0];

        if (file) {
            // Check video duration if it's a video file
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.preload = 'metadata';

                video.onloadedmetadata = () => {
                    if (video.duration > 60) {
                        toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Video cannot be longer than a minute."} />));
                        e.target.value = '';
                        return;
                    }

                    // Proceed with normal flow if video is under 1 minute
                    const updatedMedia = [...editedGuide.stepMedias];
                    updatedMedia[index] = file;

                    if (media !== null) {
                        setMediaToDelete([...mediaToDelete, media]);
                    }
                    setEditedGuide({ ...editedGuide, stepMedias: updatedMedia });
                };

                video.src = URL.createObjectURL(file);
            } else {
                // For non-video files, proceed normally
                const updatedMedia = [...editedGuide.stepMedias];
                updatedMedia[index] = file;

                if (media !== null) {
                    setMediaToDelete([...mediaToDelete, media]);
                }
                setEditedGuide({ ...editedGuide, stepMedias: updatedMedia });
            }
        }
    };

    const handleRemoveProcedure = (index, media) => {
        const updatedTitles = editedGuide.stepTitles.filter((_, i) => i !== index);
        const updatedDescriptions = editedGuide.stepDescriptions.filter((_, i) => i !== index);
        const updatedMedias = editedGuide.stepMedias.filter((_, i) => i !== index);

        setMediaToDelete([...mediaToDelete, media])
        setEditedGuide({ ...editedGuide, stepTitles: updatedTitles, stepDescriptions: updatedDescriptions, stepMedias: updatedMedias });
    };

    const handleAddProcedure = () => {
        const updatedStepDescriptions = [...editedGuide.stepDescriptions, ""];
        const updatedStepMedias = [...editedGuide.stepMedias, null];
        const updatedStepTitles = [...editedGuide.stepTitles, ""];

        setEditedGuide({
            ...editedGuide,
            stepDescriptions: updatedStepDescriptions,
            stepMedias: updatedStepMedias,
            stepTitles: updatedStepTitles,
        });
    };

    const handleSubmit = async () => {
        setTitleError(false);
        setDescriptionError(false);
        setToolsError(false);
        setMaterialsError(false);
        setClosingMessageErrors(false);

        console.log(editedGuide.stepMedias);
        
        let valid = true;

        if (!editedGuide?.title.trim()) {
            setTitleError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Title cannot be empty."} />));
            valid = false;
        };
        if (!editedGuide?.description.trim()) {
            setDescriptionError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Description cannot be empty."} />));
            valid = false;
        };
        if (editedGuide?.category !== 'tool') {
            if (editedGuide?.tools.length < 1) {
                setToolsError(true);
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Tools cannot be empty."} />));
                valid = false;
            };
        };
        if (editedGuide?.category === 'diy') {
            if (!editedGuide?.materials.trim()) {
                setMaterialsError(true);
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Materials cannot be empty."} />));
                valid = false;
            };
        };

        const updatedMediaErrors = [...stepMediasErrors];
        editedGuide.stepMedias.forEach((media, index) => {
            if (!media) {
                updatedMediaErrors[index] = true;
                valid = false;
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={`Missing media on procedure ${index + 1}.`} />));
            } else {
                updatedMediaErrors[index] = false;
            }
        });
        setStepMediasErrors(updatedMediaErrors);

        const updatedTitleErrors = [...stepTitlesErrors];
        editedGuide.stepTitles.forEach((title, index) => {
            if (!title || !title.trim()) {
                updatedTitleErrors[index] = true;
                valid = false;
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={`Missing title on procedure ${index + 1}.`} />));
            } else {
                updatedTitleErrors[index] = false;
            }
        });
        setStepTitlesErrors(updatedTitleErrors);

        const updatedDescriptionErrors = [...stepDescriptionsErrors];
        editedGuide.stepDescriptions.forEach((description, index) => {
            if (!description || !description.trim()) {
                updatedDescriptionErrors[index] = true;
                valid = false;
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={`Missing description on procedure ${index + 1}.`} />));
            } else {
                updatedDescriptionErrors[index] = false;
            }
        });
        setStepDescriptionsErrors(updatedDescriptionErrors);

        if (!editedGuide.closingMessage.trim()) {
            setClosingMessageErrors(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Closing message cannot be empty."} />));
            valid = false;
        }

        if (valid) {
            setConfirmDialogOpen(true);
        }
    }

    useEffect(() => {
        fetchGuide(id);
    }, [id, fetchGuide]);

    useEffect(() => {
        if (guide) {
            setEditedGuide({
                _id: guide._id,
                status: guide.status,
                posterId: guide.posterId,
                category: guide.category,
                title: guide.title,
                coverImage: guide.coverImage,
                description: guide.description,
                tools: guide.tools,
                materials: guide.materials,
                stepTitles: guide.stepTitles,
                stepDescriptions: guide.stepDescriptions,
                stepMedias: guide.stepMedias,
                closingMessage: guide.closingMessage,
                links: guide.links,
            });
        }
    }, [guide]);

    return (
        <>
            {fetchingGuide ? (
                <div className='w-full h-full flex flex-col items-center justify-center gap-8'>
                    <DotLoader color='blue' />
                    <h2 className='text-xl font-bold'>Fetching Guide</h2>
                </div>) : (
                <div className='w-full h-full px-2 py-4 md:px-24 md:py-6 flex flex-col gap-4 overflow-auto items-center'>

                    {/* Header */}
                    <div className='w-full flex items-center justify-center'>
                        <h1 className='text-2xl text-primary font-bold'>Edit Guide</h1>
                    </div>

                    {/* Category */}
                    <div className='w-full max-w-4xl flex flex-col gap-4'>
                        <h1 className='text-xl font-semibold'>Select a category:</h1>
                        <div className='flex flex-wrap flex-row gap-2'>
                            <Button className={`${editedGuide?.category === 'repair' ? "bg-primary text-white" : "bg-clear text-black border border-black"} cursor-pointer hover:bg-primary/80 hover:text-white`} onClick={() => setEditedGuide({ ...editedGuide, category: 'repair' })}>
                                <House /> Repair Guide
                            </Button>
                            <Button className={`${editedGuide?.category === 'tool' ? "bg-primary text-white" : "bg-clear text-black border border-black"} cursor-pointer hover:bg-primary/80 hover:text-white`} onClick={() => setEditedGuide({ ...editedGuide, category: 'tool' })}>
                                <Hammer /> Tool Guide
                            </Button>
                            <Button className={`${editedGuide?.category === 'diy' ? "bg-primary text-white" : "bg-clear text-black border border-black"} cursor-pointer hover:bg-primary/80 hover:text-white`} onClick={() => setEditedGuide({ ...editedGuide, category: 'diy' })}>
                                <Sofa /> DIY Guide
                            </Button>
                        </div>
                    </div>

                    {/* Title */}
                    <div className='w-full max-w-4xl flex flex-col'>
                        <h1 className='text-xl font-semibold'>Enter guide title:</h1>
                        <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                        <div className="grid w-full items-center gap-1.5">
                            <Input type="text" placeholder="Guide Title" value={editedGuide?.title} onChange={(e) => setEditedGuide({ ...editedGuide, title: e.target.value })}
                                className={`${titleError ? "border-red-400" : "border-black"}`} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='w-full max-w-4xl flex flex-col'>
                        <h1 className='text-xl font-semibold'>Enter guide description:</h1>
                        <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                        <div className="grid w-full items-center gap-1.5">
                            <Textarea placeholder="Guide Description" className={`h-auto ${descriptionError ? "border-red-400" : "border-black"}`} value={editedGuide?.description} onChange={(e) => setEditedGuide({ ...editedGuide, description: e.target.value })} />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className='w-full max-w-4xl flex flex-col'>
                        <h1 className='text-xl font-semibold'>Input guide cover:</h1>
                        <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                        <div className="w-full border h-56 mb-4 rounded-lg flex flex-col items-center justify-center text-gray-400 p-4 border-black">
                            {editedGuide?.coverImage ? (
                                typeof editedGuide?.coverImage === 'object' && 'url' in editedGuide.coverImage ? (
                                    <img src={editedGuide?.coverImage.url} className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => {
                                            setDisplay(editedGuide.coverImage);
                                            setImageDisplay(true);
                                        }} />
                                ) : (
                                    <img src={URL.createObjectURL(editedGuide.coverImage)} className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => {
                                            setDisplay(editedGuide.coverImage);
                                            setImageDisplay(true);
                                        }} />
                                )
                            ) : (
                                <>
                                    <Image size={100} />
                                    <span>Attach an image</span>
                                </>
                            )}

                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Input type="file" accept="image/*" className="bg-white" onChange={(e) => handleCoverImageChange(e, typeof editedGuide?.coverImage === 'object' && 'url' in editedGuide.coverImage ? editedGuide.coverImage : null)} />
                        </div>
                    </div>

                    {/* Tools */}
                    {editedGuide?.category !== 'tool' ? (
                        <div className='w-full max-w-4xl flex flex-col'>
                            <h1 className='text-xl font-semibold'>Enter Tools needed for this guide:</h1>
                            <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                            <div className="flex flex-row w-full items-center gap-1.5 mb-2">
                                <Input type="text" placeholder="Tools for guide" className={`${toolsError && "border-red-400"}`}
                                    ref={toolInputRef}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // optional: prevent form submission or newline
                                            if (e.target.value.trim()) {
                                                setEditedGuide({ ...editedGuide, tools: [...editedGuide.tools, e.target.value] });
                                                e.target.value = '';
                                            }
                                        }
                                    }} />
                                <Button className="bg-gray-300 cursor-pointer hover:bg-gray-400"
                                    onClick={() => {
                                        const inputValue = toolInputRef.current?.value.trim();
                                        if (inputValue) {
                                            setEditedGuide({
                                                ...editedGuide,
                                                tools: [...editedGuide.tools, inputValue],
                                            });
                                            toolInputRef.current.value = "";
                                        }
                                    }}
                                >Add Tool</Button>
                            </div>
                            <div className='w-full flex flex-row flex-wrap gap-2'>
                                {editedGuide?.tools.map((tool, index) => (
                                    <div className='w-auto px-2 py-2 flex flex-row bg-gray-200 items-center justify-center gap-2 rounded-lg' key={index}>
                                        <span className='flex-1'>{tool}</span>
                                        <Button className='bg-red-300 h-2 w-2 cursor-pointer hover:bg-red-400'
                                            onClick={() => setEditedGuide({ ...editedGuide, tools: [...editedGuide.tools.filter((_, i) => i !== index)] })}>
                                            -
                                        </Button>
                                    </div>
                                ))}

                            </div>
                        </div>
                    ) : null}


                    {/* Materials */}
                    {editedGuide?.category === 'diy' ? (
                        <div className='w-full max-w-4xl flex flex-col'>
                            <h1 className='text-xl font-semibold'>Enter Materials needed for this guide:</h1>
                            <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                            <div className="grid w-full items-center gap-1.5">
                                <Textarea placeholder="Materials for guide" className={`h-24 ${materialsError && 'border-red-400'}`} value={editedGuide?.materials} onChange={(e) => setEditedGuide({ ...editedGuide, materials: e.target.value })} />
                            </div>
                        </div>
                    ) : null}


                    {/* Procedures */}
                    <div className="w-full max-w-4xl flex flex-col">
                        <h1 className="text-xl font-semibold mb-6">Procedures</h1>

                        {editedGuide?.stepTitles.map((title, index) => (
                            <div className="mb-6" key={index}>
                                <div className="grid w-full items-center gap-1.5">
                                    <div className='flex flex-row items-center gap-2'>
                                        <div className='w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold'>{index + 1}</div>
                                        <h1 className='flex flex-row justify-center items-center gap-2 text-gray-600'><Info /> Input procedure informations</h1>
                                        <div className='flex-1' />
                                        {editedGuide?.stepTitles.length > 1 && (
                                            <span className='text-red-400 cursor-pointer hover:underline' onClick={() => {
                                                const mediaItem = editedGuide?.stepMedias[index];
                                                const mediaToDeleteItem = mediaItem && typeof mediaItem === "object" && "url" in mediaItem ? mediaItem : null;
                                                handleRemoveProcedure(index, mediaToDeleteItem);
                                            }}>Remove</span>
                                        )}
                                    </div>
                                    <Input type="text" placeholder="Enter Procedure / Use Title" className={`${stepTitlesErrors[index] && "border-red-400"}`} value={title} onChange={(e) => {
                                        const updatedStepTitles = editedGuide.stepTitles.map((title, i) =>
                                            i === index ? e.target.value : title
                                        );
                                        setEditedGuide({
                                            ...editedGuide,
                                            stepTitles: updatedStepTitles
                                        });
                                    }} />
                                </div>

                                <div className="grid w-full items-center gap-1.5 mt-2">
                                    <Textarea placeholder="Guide Description" className={`h-auto ${stepDescriptionsErrors[index] && "border-red-400"}`} value={editedGuide?.stepDescriptions[index]} onChange={(e) => {
                                        const updatedStepTitles = editedGuide.stepDescriptions.map((description, i) =>
                                            i === index ? e.target.value : description
                                        );
                                        setEditedGuide({
                                            ...editedGuide,
                                            stepDescriptions: updatedStepTitles
                                        });
                                    }} />
                                </div>

                                <div className={`w-full border h-56 mb-4 rounded-lg flex flex-col items-center justify-center text-gray-400 p-4 mt-2 ${stepMediasErrors[index] && "border-red-400"}`}>
                                    {editedGuide?.stepMedias[index] ? (
                                        typeof editedGuide?.stepMedias[index] === "object" && "url" in editedGuide.stepMedias[index] ? (
                                            /\.(mp4|webm|ogg|mov)$/i.test(editedGuide.stepMedias[index].url) ? (
                                                <video
                                                    key={editedGuide.stepMedias[index].name + editedGuide.stepMedias[index].lastModified}
                                                    controls
                                                    className="w-full h-full object-contain"
                                                >
                                                    <source src={editedGuide.stepMedias[index].url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={editedGuide.stepMedias[index].url}
                                                    alt={`Step media ${index + 1}`}
                                                    className="w-full h-full object-contain cursor-pointer"
                                                    onClick={() => {
                                                        setDisplay(editedGuide.stepMedias[index]);
                                                        setImageDisplay(true);
                                                    }}
                                                />
                                            )
                                        ) : (
                                            editedGuide.stepMedias[index].type?.startsWith("video") ? (
                                                <video
                                                    key={editedGuide.stepMedias[index].name + editedGuide.stepMedias[index].lastModified}
                                                    controls
                                                    className="w-full h-full object-contain"
                                                >
                                                    <source src={URL.createObjectURL(editedGuide.stepMedias[index])} type={editedGuide.stepMedias[index].type} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={URL.createObjectURL(editedGuide.stepMedias[index])}
                                                    className="w-full h-full object-contain cursor-pointer"
                                                    onClick={() => {
                                                        setDisplay(editedGuide.stepMedias[index]);
                                                        setImageDisplay(true);
                                                    }}
                                                />
                                            )
                                        )
                                    ) : (
                                        <>
                                            <Image size={100} />
                                            <span>Attach an image</span>
                                        </>
                                    )}
                                </div>

                                <div className="grid w-full items-center gap-1.5">
                                    <Input type="file" accept="image/*,video/*" className="bg-white" onChange={(e) =>
                                        handleProcedureMediaChange(
                                            e,
                                            index,
                                            editedGuide?.stepMedias[index] &&
                                                typeof editedGuide.stepMedias[index] === 'object' &&
                                                'url' in editedGuide.stepMedias[index]
                                                ? editedGuide.stepMedias[index]
                                                : null
                                        )
                                    } />
                                </div>
                            </div>
                        ))}
                        <Button className="text-black bg-white border cursor-pointer hover:bg-gray-100" onClick={handleAddProcedure}>Add procedure</Button>
                    </div>

                    {/* Closing Message */}
                    <div className='w-full max-w-4xl flex flex-col'>
                        <h1 className='text-xl font-semibold'>Enter closing message:</h1>
                        <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                        <div className="grid w-full items-center gap-1.5">
                            <Textarea placeholder="Closing Message" className={`h-24 ${closingMessageErrors && "border-red-400"}`} value={editedGuide?.closingMessage} onChange={(e) => setEditedGuide({ ...editedGuide, closingMessage: e.target.value })} />
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className='w-full max-w-4xl flex flex-col'>
                        <h1 className='text-xl font-semibold'>Enter additional links:</h1>
                        <span className='text-md text-gray-400 mb-2'>This field is <span className='font-bold'>NOT</span> required.</span>
                        <div className="grid w-full items-center gap-1.5">
                            <Textarea placeholder="Additional Links" className={`h-auto`} value={editedGuide?.links} onChange={(e) => setEditedGuide({ ...editedGuide, links: e.target.value })} />
                        </div>
                    </div>

                    <div className="w-full max-w-4xl flex flex-col">
                        <Button className={`text-white w-full ${updatingGuide ? "bg-primary/50 pointer-not-allowed hover:bg-primary/50" : "cursor-pointer"}`} onClick={handleSubmit} disabled={updatingGuide}>
                            {updatingGuide ? (
                                <PulseLoader color='white' size={12} />
                            ) : (
                                "Update Guide"
                            )}
                        </Button>
                    </div>

                </div>
            )}
            {imageDisplay && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onClick={() => setImageDisplay(false)}
                >
                    <img
                        src={
                            display instanceof File
                                ? URL.createObjectURL(display)
                                : display.url
                        }
                        className="max-w-full max-h-full object-contain"
                        alt="Full Preview"
                    />
                </div>
            )}

            {confirmDialogOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
                        onClick={(e) => e.stopPropagation()} // Prevent background click from closing
                    >
                        <h2 className="text-lg font-semibold mb-4">Confirm Edit</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to save these changes to your guide?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirmDialogOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { updateGuide(editedGuide, mediaToDelete); setConfirmDialogOpen(false) }}
                                className={`${!updatingGuide ? "bg-green-500 hover:bg-green-600" : "bg-green-500/50 cursor-not-allowed"}  text-white font-semibold py-2 px-4 rounded`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditGuide