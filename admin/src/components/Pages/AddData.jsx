import React from 'react'
import { Button } from "@/components/ui/button"

import useChatbotStore from '../../../store/chatbot.store.jsx';

function AddData() {
    const { embeddingData, embedData } = useChatbotStore();
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <Button className="text-white" disabled={embeddingData}>Update Chatbot</Button>
    </div>
  )
}

export default AddData
