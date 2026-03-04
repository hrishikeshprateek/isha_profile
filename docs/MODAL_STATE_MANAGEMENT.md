# Modal State Management - Single Modal Implementation

## Overview
Implemented a global modal state management system to ensure only one download preview modal can be open at a time across the entire application.

## Changes Made

### 1. Created ModalProvider (`components/ModalProvider.tsx`)
- **Purpose**: Provides global modal state management using React Context
- **Features**:
  - `openModalId`: Tracks which modal is currently open
  - `openModal(id)`: Opens a modal with specific ID
  - `closeModal(id)`: Closes the modal if it matches the ID
  - `useModal()`: Custom hook to access modal state

### 2. Updated DownloadQuote Component
- **Integrated with ModalProvider**: Uses `useModal()` hook instead of local state
- **Modal ID Generation**: Each quote gets a unique modal ID: `quote-modal-${quoteId}`
- **State Management**:
  - Removed local `showPreview` state
  - Added `isModalOpen` computed from global `openModalId`
  - Updated all handlers to use `openModal()` and `closeModal()`

### 3. Updated Root Layout (`app/layout.tsx`)
- **Added ModalProvider wrapper** around the entire app
- Ensures all modals across all pages use the same global state

### 4. Benefits

✅ **Only one modal open at a time**: When user opens a quote preview on one card, any other open modal closes automatically

✅ **Global state**: Works across all pages and components

✅ **Simple API**: Just use `useModal()` hook in any component

✅ **No prop drilling**: Don't need to pass modal state through multiple levels

## How It Works

1. **Opening a Modal**:
   ```
   User clicks Download → handlePreview() called
   → openModal(modalId) sets global openModalId
   → Component checks isModalOpen === true
   → Dialog renders
   ```

2. **Closing a Modal**:
   ```
   User clicks Cancel/Close → closeModal(modalId) called
   → openModalId set to null
   → isModalOpen becomes false
   → Dialog unmounts
   ```

3. **Switching Between Modals**:
   ```
   Modal A is open (openModalId = "quote-modal-1")
   User clicks Download on another card (openModal("quote-modal-2"))
   → openModalId changes to "quote-modal-2"
   → Modal A's isModalOpen becomes false
   → Modal B's isModalOpen becomes true
   → Modal A closes, Modal B opens
   ```

## Usage in Components

```tsx
import { useModal } from "@/components/ModalProvider";

function MyComponent() {
  const { openModalId, openModal, closeModal } = useModal();
  const myModalId = "my-modal-123";
  const isOpen = openModalId === myModalId;
  
  return (
    <>
      <button onClick={() => openModal(myModalId)}>Open</button>
      {isOpen && <Modal onClose={() => closeModal(myModalId)} />}
    </>
  );
}
```

## Files Modified
- `components/DownloadQuote.tsx` - Integrated modal context
- `components/ModalProvider.tsx` - New file
- `app/layout.tsx` - Added ModalProvider wrapper

## Testing
- Navigate to `/quotes`
- Click Download on multiple cards
- Verify only one preview modal shows at a time
- Navigate to `/quotes/[id]`
- Click Download
- Verify modal shows and closes properly

