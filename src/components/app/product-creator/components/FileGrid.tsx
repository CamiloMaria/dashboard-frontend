import React, { useRef, useMemo } from 'react';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { FileWithPreview } from '../hooks/useFileUpload';

interface FilePreviewProps {
    file: FileWithPreview;
    onRemove: (file: FileWithPreview) => void;
}

// Memoized file preview component
const FilePreview = React.memo(function FilePreview({
    file,
    onRemove
}: FilePreviewProps) {
    return (
        <div className="relative flex-shrink-0 w-full">
            <div className="absolute inset-0 border rounded-md overflow-hidden bg-muted/50 group">
                <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onRemove(file)}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
                {typeof file.uploadProgress === 'number' && file.uploadProgress > 0 && file.uploadProgress < 100 && (
                    <div className="absolute bottom-6 left-0 right-0 h-1 bg-muted">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${file.uploadProgress}%` }}
                        />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-[10px] p-0.5 truncate">
                    {file.baseSku}{file.position ? `-${file.position}` : ''}
                </div>
            </div>
        </div>
    );
});

interface FileGridProps {
    files: FileWithPreview[];
    onRemove: (file: FileWithPreview) => void;
}

export function FileGrid({ files, onRemove }: FileGridProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const columnCount = useMemo(() => {
        if (typeof window === 'undefined') return 2;
        if (window.innerWidth >= 768) return 6;
        if (window.innerWidth >= 640) return 4;
        return 2;
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: Math.ceil(files.length / columnCount),
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,
    });

    return (
        <div
            ref={parentRef}
            className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted/50 pr-2"
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    position: 'relative',
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
                    const startIndex = virtualRow.index * columnCount;
                    const rowFiles = files.slice(startIndex, startIndex + columnCount);

                    return (
                        <div
                            key={virtualRow.index}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100px',
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2"
                        >
                            {rowFiles.map((file, index) => (
                                <FilePreview
                                    key={`${virtualRow.index}-${index}`}
                                    file={file}
                                    onRemove={onRemove}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 