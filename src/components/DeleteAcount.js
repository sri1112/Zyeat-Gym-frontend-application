import React from 'react';

// Define custom colors based on your Tailwind configuration for easy reference
const customColors = {
  'app-purple': '#4F46E5', // Indigo-600
  'app-orange': '#F97316', // Orange-500
  'primary-dark': '#1F2937', // Gray-800
};

// Reusable SVG for the warning list item
const WarningIcon = () => (
    <svg 
        className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" 
        fill="currentColor" 
        viewBox="0 0 20 20"
    >
        <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clipRule="evenodd"
        />
    </svg>
);

const DeleteAcount = () => {

    // Mock handler for account deletion
    const handleDelete = () => {
        const confirmed = window.confirm(
            "Are you absolutely sure you want to permanently delete your GymBite account? This action is irreversible."
        );
        if (confirmed) {
            // In a real application: 
            // 1. Call a deletion API
            // 2. Clear local storage/session
            // 3. Navigate to the login screen
            console.log("Account deletion confirmed and initiated.");
            window.location.href = '/'; // Redirect to login as per original code
        }
    };

    // Mock handler to cancel and go back
    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="flex justify-center bg-gray-100 font-sans min-h-screen">
            <div className="main-container shadow-2xl bg-white flex flex-col min-h-screen w-full max-w-sm">

                {/* Sticky Top Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex items-center p-4">
                        <button 
                            onClick={handleCancel} 
                            className="mr-4 p-1 rounded-full text-gray-500 hover:text-app-purple transition-colors"
                            style={{ '--app-purple': customColors['app-purple'] }} // Using style prop for dynamic color
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Account Deletion</h1>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow overflow-y-auto p-6 flex flex-col justify-between"> 
                    
                    <div className="text-left">
                        {/* Warning Box */}
                        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-lg font-bold text-red-600 mb-2">
                                ⚠️ Permanent Action Required
                            </p>
                            <p className="text-sm text-red-700">
                                Deleting your account will **permanently erase all data**, including your health progress, custom plans, and order history.
                            </p>
                        </div>

                        <h2 className="text-xl font-bold mb-4" style={{ color: customColors['primary-dark'] }}>
                            Are you sure you want to proceed?
                        </h2>
                        
                        <div className="space-y-4 text-gray-600 text-sm">
                            {/* Warning 1 */}
                            <p className="flex items-start">
                                <WarningIcon />
                                All subscription data will be lost.
                            </p>
                            {/* Warning 2 */}
                            <p className="flex items-start">
                                <WarningIcon />
                                Your progress tracking data will be deleted.
                            </p>
                            <p className="text-xs italic text-gray-500 pt-4">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-12 space-y-3 pb-4">
                        <button 
                            onClick={handleDelete}
                            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl 
                                       shadow-lg hover:bg-red-700 transition-colors"
                        >
                            CONFIRM DELETE ACCOUNT
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl 
                                       hover:bg-gray-300 transition-colors"
                        >
                            Cancel & Keep My Account
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default DeleteAcount;