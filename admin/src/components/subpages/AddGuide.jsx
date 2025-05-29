import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { House, Hammer, Sofa, Image, Info } from 'lucide-react';
import ToastUnsuccessful from '../util/ToastUnsuccessful.jsx'

import useAdminStore from '../../../store/admin.store.jsx';
import useGuideStore from '../../../store/guide.store.jsx'

function AddGuide() {

    const { admin } = useAdminStore();
    const { postGuide, postingGuide } = useGuideStore();

    const [category, setCategory] = useState('repair');

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(false);

    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(false);

    const [coverImage, setCoverImage] = useState();
    const [coverImageError, setCoverImageError] = useState(false);
    const [coverImageFull, setCoverImageFull] = useState(false);

    const [tools, setTools] = useState([]);
    const [pendingTool, setPendingTool] = useState('');
    const [toolsError, setToolsError] = useState();

    const [materials, setMaterials] = useState('');
    const [materialsError, setMaterialsError] = useState(false);

    const [stepTitles, setStepTitles] = useState(['']);
    const [stepTitlesError, setStepTitlesError] = useState([false]);

    const [stepDescriptions, setStepDescriptions] = useState(['']);
    const [stepDescriptionsError, setStepDescriptionsError] = useState([false]);

    const [stepMedias, setStepMedias] = useState([null]);
    const [stepMediasError, setStepMediasError] = useState([false]);
    const [procedureImageDisplay, setProcedureImageDisplay] = useState(false); //tells wehter image is displayed or not
    const [procedureImage, setProcedureImage] = useState(); //what is the index.

    const [closingMessage, setClosingMessage] = useState('');
    const [closingMessageError, setClosingMessageError] = useState(false);

    const [links, setLinks] = useState('');

    //Clear form
    const resetForm = () => {
        setCategory('repair');

        setTitle('');
        setTitleError(false);

        setDescription('');
        setDescriptionError(false);

        setCoverImage(undefined);
        setCoverImageError(false);
        setCoverImageFull(false);

        setTools([]);
        setPendingTool('');
        setToolsError(undefined);

        setMaterials('');
        setMaterialsError(false);

        setStepTitles(['']);
        setStepTitlesError([false]);

        setStepDescriptions(['']);
        setStepDescriptionsError([false]);

        setStepMedias([null]);
        setStepMediasError([false]);

        setProcedureImageDisplay(false);
        setProcedureImage(undefined);

        setClosingMessage('');
        setClosingMessageError(false);

        setLinks('');
    };

    //Adding Cover Image Logic
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
        }
    };

    //Adding Medias to procedure logic
    const handleStepMediaChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if the file is a video
        if (file.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src); // Clean up memory
                const duration = video.duration;

                if (duration > 60) {
                    const updatedErrors = [...stepMediasError];
                    updatedErrors[index] = true;
                    setStepMediasError(updatedErrors);
                    toast.custom((t) => (
                        <ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Input error!"} message={"The video submitted is too long."} />
                    ));
                } else {
                    const updatedMedia = [...stepMedias];
                    updatedMedia[index] = file;
                    setStepMedias(updatedMedia);

                    const updatedErrors = [...stepMediasError];
                    updatedErrors[index] = false;
                    setStepMediasError(updatedErrors);
                }
            };

            video.src = URL.createObjectURL(file);
        } else {
            // It's an image, no duration check needed
            const updatedMedia = [...stepMedias];
            updatedMedia[index] = file;
            setStepMedias(updatedMedia);

            const updatedErrors = [...stepMediasError];
            updatedErrors[index] = false;
            setStepMediasError(updatedErrors);
        }
    };

    //Adding steps / procedure logic
    const addStep = () => {
        setStepTitles([...stepTitles, '']);
        setStepDescriptions([...stepDescriptions, '']);
        setStepTitlesError([...stepTitlesError, false]);
        setStepDescriptionsError([...stepDescriptionsError, false]);
        setStepMedias([...stepMedias, null]);
        setStepMediasError([...stepMediasError, false]);
    };
    const removeStep = (index) => {
        if (stepTitles.length <= 1) return; // prevent removing the last step

        setStepTitles(stepTitles.filter((_, i) => i !== index));
        setStepDescriptions(stepDescriptions.filter((_, i) => i !== index));
        setStepTitlesError(stepTitlesError.filter((_, i) => i !== index));
        setStepDescriptionsError(stepDescriptionsError.filter((_, i) => i !== index));
        setStepMedias(stepMedias.filter((_, i) => i !== index));
        setStepMediasError(stepMediasError.filter((_, i) => i !== index));
    };

    const removeTool = (index) => {
        setTools(tools.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        let valid = true;
        setTitleError(false);
        setDescriptionError(false);
        setCoverImageError(false);
        setClosingMessageError(false)
        setToolsError(false);
        setMaterialsError(false);

        if (!title.trim()) {
            setTitleError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Title cannot be empty."} />));
            valid = false
        }
        if (!description.trim()) {
            setDescriptionError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Description cannot be empty."} />));
            valid = false
        }
        if (!coverImage) {
            setCoverImageError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Cover Image required."} />));
            valid = false
        }

        if (category !== 'tool') {
            if (tools.length < 1) {
                setToolsError(true);
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Tools cannot be empty."} />));
                valid = false
            }
        };

        if (category === 'diy') {
            if (!materials.trim()) {
                setMaterialsError(true);
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Materials cannot be empty."} />));
                valid = false
            }
        }

        //Media Fields Check
        const updatedMediaErrors = [...stepMediasError];
        stepMedias.forEach((media, index) => {
            if (!media) {
                updatedMediaErrors[index] = true;
                valid = false
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={`Missing media on procedure ${index + 1}.`} />));
            } else {
                updatedMediaErrors[index] = false;
            }
        });
        setStepMediasError(updatedMediaErrors);

        //Step Title Check
        const updatedTitleErrors = [...stepTitlesError];
        stepTitles.forEach((title, index) => {
            if (!title) {
                updatedTitleErrors[index] = true;
                valid = false
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={`Missing title on procedure ${index + 1}.`} />));
            } else {
                updatedTitleErrors[index] = false;
            }
        });
        setStepTitlesError(updatedTitleErrors);

        //Step Description Check
        const updatedDescriptionError = [...stepDescriptionsError];
        stepDescriptions.forEach((description, index) => {
            if (!description) {
                updatedDescriptionError[index] = true;
                valid = false
                toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={`Missing description on procedure ${index + 1}.`} />));
            } else {
                updatedDescriptionError[index] = false;
            }
        });
        setStepDescriptionsError(updatedDescriptionError);

        if (!closingMessage.trim()) {
            setClosingMessageError(true);
            toast.custom((t) => (<ToastUnsuccessful dismiss={() => toast.dismiss(t)} title={"Invalid input!"} message={"Closing Message cannot be empty."} />));
            valid = false
        };

        if (valid) {
            const data = {
                posterId: admin._id, category: category, title: title, description: description, coverImage: coverImage, tools: tools, materials: materials, stepTitles: stepTitles, stepDescriptions: stepDescriptions, stepMedias: stepMedias, closingMessage: closingMessage, links: links
            };
            const res = await postGuide(data);
            if (res) {
                resetForm();
            }
        }
    }


    return (
        <div className='w-full h-full px-2 py-4 md:px-24 md:py-6 flex flex-col gap-4 overflow-auto items-center'>

            {/* Header */}
            <div className='w-full flex items-center justify-center'>
                <h1 className='text-2xl text-primary font-bold '>
                    Add a new Guide
                </h1>
            </div>

            {/* Category */}
            <div className='w-full max-w-4xl flex flex-col gap-4'>
                <h1 className='text-xl font-semibold'>
                    Select a category:
                </h1>
                <div className='flex flex-wrap flex-row gap-2'>
                    <Button className={`${category === 'repair' ? "bg-primary text-white" : "bg-clear text-black border border-black"} cursor-pointer hover:bg-primary/80 hover:text-white`} onClick={() => setCategory('repair')}>
                        <House /> Repair Guide
                    </Button>
                    <Button className={`${category === 'tool' ? "bg-primary text-white" : "bg-clear text-black border border-black"} cursor-pointer hover:bg-primary/80 hover:text-white`} onClick={() => setCategory('tool')}>
                        <Hammer /> Tool Guide
                    </Button>
                    <Button className={`${category === 'diy' ? "bg-primary text-white" : "bg-clear text-black border border-black"} cursor-pointer hover:bg-primary/80 hover:text-white`} onClick={() => setCategory('diy')}>
                        <Sofa /> DIY Guide
                    </Button>
                </div>
            </div>

            {/* Title */}
            <div className='w-full max-w-4xl flex flex-col'>
                <h1 className='text-xl font-semibold'>
                    Enter guide title:
                </h1>
                <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                <div className="grid w-full  items-center gap-1.5">
                    <Input type="text" placeholder="Guide Title" value={title} onChange={(e) => { setTitle(e.target.value) }} className={`${titleError && 'border-red-400'}`} />
                </div>
            </div>

            {/* Description */}
            <div className='w-full max-w-4xl flex flex-col'>
                <h1 className='text-xl font-semibold'>
                    Enter guide description:
                </h1>
                <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                <div className="grid w-full  items-center gap-1.5">
                    <Textarea placeholder="Guide Description" className={`h-24 ${descriptionError && 'border-red-400'}`}
                        value={description} onChange={(e) => { setDescription(e.target.value) }} />
                </div>
            </div>

            {/* Cover Image */}
            <div className='w-full max-w-4xl flex flex-col'>
                <h1 className='text-xl font-semibold'>
                    Input guide cover:
                </h1>
                <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                <div className={`w-full border h-56 mb-4 rounded-lg flex flex-col items-center justify-center text-gray-400 p-4 ${coverImageError ? 'border-red-400' : 'border-black'}`}>
                    {!coverImage ? (
                        <>
                            <Image size={100} />
                            <span>Attach an image</span>
                        </>
                    ) : (
                        <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-contain cursor-pointer" onClick={() => setCoverImageFull(true)} />
                    )}

                </div>
                <div className="grid w-full  items-center gap-1.5">
                    <Input type="file" accept="image/*" onChange={handleCoverImageChange} className={`bg-white cursor-pointer`} />
                </div>
            </div>

            {/* Tools */}
            {category !== 'tool' ? (
                <div className='w-full max-w-4xl flex flex-col'>
                    <h1 className='text-xl font-semibold'>
                        Enter Tools needed for this guide:
                    </h1>
                    <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                    <div className="flex flex-row  w-full  items-center gap-1.5 mb-2">
                        <Input type="text" placeholder="Tools for guide" value={pendingTool} onChange={(e) => { setPendingTool(e.target.value) }} className={`${toolsError && 'border-red-400'}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // optional: prevent form submission or newline
                                    if (pendingTool.trim()) { setTools([...tools, pendingTool]); setPendingTool('') }
                                }
                            }} />
                        <Button className="bg-gray-300 hover:bg-gray-300/50" onClick={() => { if (pendingTool.trim()) { setTools([...tools, pendingTool]); setPendingTool('') } }}>Add Tool</Button>
                    </div>
                    <div className='w-full flex flex-row flex-wrap gap-2'>
                        {tools.length > 0 && tools.map((tool, index) => (
                            <div className='w-auto px-2 py-2 flex flex-row bg-gray-200 items-center justify-center gap-2 rounded-lg' key={index}>
                                <span className='flex-1'>{tool}</span>
                                <Button className='bg-red-300 h-2 w-2 cursor-pointer hover:bg-red-500/50' onClick={() => removeTool(index)}>-</Button>
                            </div>
                        ))}

                    </div>
                </div>
            ) : (null)}

            {/* Materials */}
            {category === 'diy' ? (
                <div className='w-full max-w-4xl flex flex-col'>
                    <h1 className='text-xl font-semibold'>
                        Enter Materials needed for this guide:
                    </h1>
                    <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                    <div className="grid w-full  items-center gap-1.5">
                        <Textarea placeholder="Materials for guide" className={`h-24 ${materialsError && 'border-red-400'}`}
                            value={materials} onChange={(e) => { setMaterials(e.target.value) }} />
                    </div>
                </div>
            ) : (null)}



            {/* Procedures */}
            <div className="w-full max-w-4xl flex flex-col">
                <h1 className="text-xl font-semibold mb-6">Procedures</h1>

                {stepTitles.map((title, index) => (
                    <div key={index} className="mb-6">
                        <div className="grid w-full items-center gap-1.5">
                            <div className='flex flex-row items-center  gap-2'>
                                <div className='w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold'>
                                    {index + 1}
                                </div>
                                <h1 className='flex flex-row justify-center items-center gap-2 text-gray-600'><Info /> Input procedure informations</h1>
                                <div className='flex-1' />
                                {stepTitles.length > 1 && (
                                    <span className='text-red-400 cursor-pointer hover:underline' onClick={() => removeStep(index)}>Remove</span>
                                )}
                            </div>
                            <Input
                                type="text"
                                placeholder="Enter Procedure / Use Title"
                                value={title}
                                onChange={(e) => {
                                    const updated = [...stepTitles];
                                    updated[index] = e.target.value;
                                    setStepTitles(updated);
                                }}
                                className={`${stepTitlesError[index] && 'border-red-400'}`}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1.5 mt-2">
                            <Textarea
                                placeholder="Guide Description"
                                className={`h-24 ${stepDescriptionsError[index] && 'border-red-400'}`}
                                value={stepDescriptions[index] || ''}
                                onChange={(e) => {
                                    const updated = [...stepDescriptions];
                                    updated[index] = e.target.value;
                                    setStepDescriptions(updated);
                                }}
                            />
                        </div>

                        <div className={`w-full border h-56 mb-4 rounded-lg flex flex-col items-center justify-center text-gray-400 p-4 mt-2  ${stepMediasError[index] ? 'border-red-400' : 'border-black'}`}>
                            {!stepMedias[index] ? (
                                <>
                                    <Image size={100} />
                                    <span>Attach an image or video</span>
                                </>
                            ) : (
                                <>
                                    {stepMedias[index].type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(stepMedias[index])}
                                            className="w-full h-full object-contain cursor-pointer"
                                            onClick={() => {
                                                setProcedureImage(index);
                                                setProcedureImageDisplay(true);
                                            }}
                                            alt={`Step ${index + 1} media`}
                                        />
                                    ) : (
                                        <video
                                            controls
                                            className="w-full h-full object-contain cursor-pointer"
                                        >
                                            <source src={URL.createObjectURL(stepMedias[index])} />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => { handleStepMediaChange(e, index) }}
                                className="bg-white cursor-pointer"
                            />
                        </div>
                    </div>
                ))}

                <Button className="text-black cursor-pointer bg-white hover:bg-white/50 border" onClick={addStep}>
                    Add procedure
                </Button>
            </div>

            {/* Closing Message */}
            <div className='w-full max-w-4xl flex flex-col'>
                <h1 className='text-xl font-semibold'>
                    Enter closing message:
                </h1>
                <span className='text-md text-gray-400 mb-2'>This field is required.</span>
                <div className="grid w-full  items-center gap-1.5">
                    <Textarea placeholder="Closing Message" className={`h-24 ${closingMessageError && 'border-red-400'}`}
                        value={closingMessage} onChange={(e) => { setClosingMessage(e.target.value) }} />
                </div>
            </div>

            {/* Additional Links */}
            <div className='w-full max-w-4xl flex flex-col'>
                <h1 className='text-xl font-semibold'>
                    Enter additional links:
                </h1>
                <span className='text-md text-gray-400 mb-2'>This field is <span className='font-bold'>NOT</span> required.</span>
                <div className="grid w-full  items-center gap-1.5">
                    <Textarea placeholder="Additional links" className={`h-24`}
                        value={links} onChange={(e) => { setLinks(e.target.value) }} />
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col">
                <Button className={`text-white w-full  ${postingGuide ? "bg-primary/50 cursor-not-allowed" : "cursor-pointer"}`} onClick={handleSubmit} disabled={postingGuide}>
                    Post Guide
                </Button>
            </div>


            {coverImageFull && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onClick={() => setCoverImageFull(false)}
                >
                    <img
                        src={URL.createObjectURL(coverImage)}
                        className="max-w-full max-h-full object-contain"
                        alt="Full Preview"
                    />
                </div>
            )}

            {procedureImageDisplay && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                    onClick={() => setProcedureImageDisplay(false)}
                >
                    <img
                        src={URL.createObjectURL(stepMedias[procedureImage])}
                        className="max-w-full max-h-full object-contain"
                        alt="Full Preview"
                    />
                </div>
            )}

        </div>
    )
}

export default AddGuide