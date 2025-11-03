import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function ForceLoginDialog({ isOpen, onClose, onConfirm, isLoading }) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Account Already In Use</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-700">
                        This account is currently logged in from another location. 
                        Do you want to log out from the other device and continue here?
                        <br /><br />
                        <span className="text-red-600 font-semibold">
                            The other session will be immediately terminated.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading} className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm} 
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? "Logging in..." : "Yes, Log Me In"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ForceLoginDialog;
