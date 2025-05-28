import React from 'react'
import { useNavigate } from 'react-router-dom'

import  { Button } from '@/components/ui/button'

function Guides() {

    const navigate = useNavigate();

  return (
    <div className='w-full h-full px-2 py-4 md:px-6 md:py-6 flex flex-col gap-4 overflow-auto'>

        {/* Header */}
        <div className='w-full flex flex-row'>
            <h1 className='text-2xl text-primary font-bold '>
                Guides
            </h1>
            <div className='flex-1'/>
            <Button className='text-white cursor-pointer' onClick={() => {navigate('/guides/add-guide')}}>
                Add Guide
            </Button>
        </div>

    </div>
  )
}

export default Guides