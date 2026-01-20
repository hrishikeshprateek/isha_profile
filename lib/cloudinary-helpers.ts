// Helper function for uploading images from Quill editor to Cloudinary
export async function uploadImageToCloudinary(file: File, folder: string = 'blogs'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64String = reader.result as string;

        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64String,
            folder: `isha-portfolio/${folder}`
          }),
        });

        const data = await response.json();

        if (data.success && data.url) {
          resolve(data.url);
        } else {
          reject(new Error(data.error || 'Upload failed'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// Custom image handler for Quill editor
export function createQuillImageHandler(folder: string = 'blogs') {
  return function imageHandler(this: { quill: { getSelection: (focus?: boolean) => { index: number }; insertText: (index: number, text: string) => void; deleteText: (index: number, length: number) => void; insertEmbed: (index: number, type: string, value: string) => void; setSelection: (index: number, length: number) => void } }) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      try {
        const quill = this.quill;
        const range = quill.getSelection(true);

        // Show loading state
        quill.insertText(range.index, 'Uploading image...');

        // Upload to Cloudinary
        const url = await uploadImageToCloudinary(file, folder);

        // Remove loading text and insert image
        quill.deleteText(range.index, 'Uploading image...'.length);
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1, 0);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    };
  };
}

// Enhanced Quill modules with Cloudinary image upload
export function getQuillModulesWithCloudinary(folder: string = 'blogs') {
  return {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'video', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: createQuillImageHandler(folder)
      }
    }
  };
}

