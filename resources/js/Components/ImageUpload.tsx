import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Image as ImageIcon, RefreshCw, Upload, X } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface ImageUploadProps {
    label: string;
    value?: string | null;
    onChangeFile: (file: File | null) => void;
    onClear?: () => void;
    error?: string;
    helperText?: string;
    hint?: string;
    aspectRatio?: 'square' | 'video' | 'portrait';
    maxSizeMB?: number;
    className?: string;
}

export default function ImageUpload({
    label,
    value,
    onChangeFile,
    onClear,
    error,
    helperText,
    hint,
    aspectRatio = 'video',
    maxSizeMB = 3,
    className = '',
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (!fileName) {
            setPreviewUrl(value || null);
        }
    }, [value]);

    const handleFile = (file: File | null) => {
        setValidationError(null);
        if (!file) {
            onChangeFile(null);
            setFileName(null);
            setPreviewUrl(value || null);
            return;
        }

        // Validate type
        if (!file.type.startsWith('image/')) {
            setValidationError('File harus berupa gambar (JPG, PNG, atau WEBP).');
            return;
        }

        // Validate size
        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setValidationError(`Ukuran file maksimal ${maxSizeMB}MB.`);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setFileName(file.name);
        onChangeFile(file);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0] || null;
        handleFile(file);
    };

    const handleClear = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFileName(null);
        setPreviewUrl(null);
        onChangeFile(null);
        onClear?.();
    };

    const effectiveHelper = hint || helperText || 'Mendukung format JPG, PNG, atau WEBP.';

    const ratioClasses = {
        square: 'w-32 h-32',
        portrait: 'w-40 aspect-[4/5]',
        video: 'w-full aspect-[16/9] max-h-56',
    }[aspectRatio];

    return (
        <div className={`space-y-2 ${className}`}>
            <InputLabel value={label} />

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleFileInputChange}
            />

            {previewUrl ? (
                /* Preview Container */
                <div className="relative group rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-sm inline-block">
                    <div className={`${ratioClasses} flex items-center justify-center overflow-hidden`}>
                        <img
                            src={previewUrl}
                            alt="Pratinjau"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-semibold hover:bg-white shadow transition-colors flex items-center gap-1.5"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Ganti Foto</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow transition-colors"
                            title="Hapus foto"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {fileName && (
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-2 py-1 text-[11px] text-white truncate">
                            {fileName}
                        </div>
                    )}
                </div>
            ) : (
                /* Upload Dropzone */
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                        isDragOver
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-blue-600 hover:underline">
                                Klik untuk unggah file
                            </span>
                            <span className="text-xs text-slate-500"> atau seret gambar ke sini</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            {effectiveHelper} Maksimal {maxSizeMB}MB.
                        </p>
                    </div>
                </div>
            )}

            <InputError message={validationError || error} className="mt-1" />
        </div>
    );
}
