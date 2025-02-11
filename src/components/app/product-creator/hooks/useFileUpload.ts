import { useReducer, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FileWithPreview extends File {
    preview: string | undefined;
    baseSku: string;
    position: string;
    hash: string | undefined;
    uploadProgress: number | undefined;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type FileAction =
    | { type: 'ADD_FILES'; files: FileWithPreview[] }
    | { type: 'REMOVE_FILE'; file: FileWithPreview }
    | { type: 'CLEAR_FILES' }
    | { type: 'CLEANUP_PREVIEWS' }
    | { type: 'UPDATE_PROGRESS'; file: FileWithPreview; progress: number };

function fileReducer(state: FileWithPreview[], action: FileAction): FileWithPreview[] {
    switch (action.type) {
        case 'ADD_FILES':
            return [...state, ...action.files];
        case 'REMOVE_FILE':
            if (action.file.preview) {
                URL.revokeObjectURL(action.file.preview);
            }
            return state.filter(f => f !== action.file);
        case 'CLEAR_FILES':
            state.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
            return [];
        case 'CLEANUP_PREVIEWS':
            state.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
            return state;
        case 'UPDATE_PROGRESS':
            return state.map(file =>
                file === action.file
                    ? { ...file, uploadProgress: action.progress }
                    : file
            );
        default:
            return state;
    }
}

// Calculate file hash for duplicate detection
const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Extract base SKU from filename
const extractBaseSku = (filename: string): { baseSku: string; position: string } => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const match = nameWithoutExt.match(/^(.+?)(?:[-()](\d+))?$/);

    if (!match) {
        return { baseSku: nameWithoutExt, position: '' };
    }

    const [, baseSku, position] = match;
    return {
        baseSku,
        position: position || ''
    };
};

export function useFileUpload() {
    const [files, dispatch] = useReducer(fileReducer, []);
    const { toast } = useToast();

    const validateFile = useCallback(async (file: File): Promise<{ isValid: boolean; error?: string }> => {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.map(t => t.split('/')[1]).join(', ')}`
            };
        }

        if (file.size > MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            };
        }

        const hash = await calculateFileHash(file);
        const isDuplicate = files.some(f => f.hash === hash);
        if (isDuplicate) {
            return {
                isValid: false,
                error: 'Duplicate file detected'
            };
        }

        return { isValid: true };
    }, [files]);

    const handleFileSelect = useCallback(async (selectedFiles: File[], onSkuExtracted?: (sku: string) => void) => {
        const newFiles: FileWithPreview[] = [];

        for (const file of selectedFiles) {
            const validation = await validateFile(file);
            if (!validation.isValid) {
                toast({
                    title: 'Invalid file',
                    description: `${file.name}: ${validation.error}`,
                    variant: 'destructive',
                });
                continue;
            }

            const { baseSku, position } = extractBaseSku(file.name);
            const hash = await calculateFileHash(file);

            // Create a small preview using createImageBitmap
            const bitmap = await createImageBitmap(file, {
                resizeWidth: 200,
                resizeHeight: 200,
                resizeQuality: 'medium'
            });

            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(bitmap, 0, 0);
                bitmap.close();

                const fileWithPreview = Object.assign(file, {
                    preview: canvas.toDataURL('image/jpeg', 0.7),
                    baseSku,
                    position,
                    hash,
                    uploadProgress: 0,
                }) as FileWithPreview;

                newFiles.push(fileWithPreview);
                onSkuExtracted?.(baseSku);
            }
        }

        dispatch({ type: 'ADD_FILES', files: newFiles });
        return newFiles;
    }, [validateFile, toast]);

    const removeFile = useCallback((file: FileWithPreview) => {
        dispatch({ type: 'REMOVE_FILE', file });
    }, []);

    const clearFiles = useCallback(() => {
        dispatch({ type: 'CLEAR_FILES' });
    }, []);

    const updateProgress = useCallback((file: FileWithPreview, progress: number) => {
        dispatch({ type: 'UPDATE_PROGRESS', file, progress });
    }, []);

    return {
        files,
        handleFileSelect,
        removeFile,
        clearFiles,
        updateProgress,
    };
}

export type { FileWithPreview }; 