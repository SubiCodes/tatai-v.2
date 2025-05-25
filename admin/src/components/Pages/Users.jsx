import React from 'react'
import { useState } from 'react'

import AddUserDialog from '../dialogs/AddUserDialog.jsx'

import { Button } from "@/components/ui/button"

function Users() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <div className='w-full h-full px-2 py-4 md:px-6 md:py-6'>
            {/* Header */}
            <div className='w-full flex flex-row'>
                <h1 className='text-2xl text-primary font-bold '>Users</h1>
                <div className='flex flex-1' />
                <Button className="text-white cursor-pointer" onClick={openDialog}>
                    Add User
                </Button>
            </div>

            <AddUserDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
            />
        </div>
    )
}

export default Users