"use client"

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Image } from '@imagekit/next'

interface Props {
    onChange: (url: string | undefined) => void;
    value?: string;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ImageUpload = ({ onChange, value }: Props) => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const authenticator = async () => {
        try {
            const response = await fetch("/api/auth/imageKit");
            if (!response.ok) throw new Error(`Status: ${response.status}`);

            const data = await response.json();

            // Проверяем наличие всех необходимых полей
            if (!data.token || !data.expire || !data.signature) {
                throw new Error("Invalid response from auth endpoint");
            }

            // Проверяем что expire в допустимом диапазоне
            const currentTime = Math.floor(Date.now() / 1000);
            if (data.expire <= currentTime || data.expire > currentTime + 3600) {
                throw new Error("Invalid expire time received");
            }

            return data;
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Failed to get auth params");
        }
    };

    const validateFile = (file: File) => {
        if (!file.type.match('image.*')) {
            throw new Error("Только изображения разрешены");
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`Максимальный размер: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
    };

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.length) {
            setError("Выберите файл");
            return;
        }

        const file = fileInputRef.current.files[0];

        try {
            validateFile(file);
        } catch (err: any) {
            setError(err.message);
            resetFileInput();
            return;
        }

        setIsUploading(true);
        setError(null);

        abortControllerRef.current = new AbortController();

        try {
            const authParams = await authenticator();

            const uploadResponse = await upload({
                ...authParams,
                file,
                fileName: `img-${Date.now()}-${file.name.substring(0, 20)}`,
                onProgress: (event) => {
                    setProgress(Math.round((event.loaded / event.total) * 100));
                },
                abortSignal: abortControllerRef.current.signal,
                uploadOptions: {
                    responseFields: ['url'],
                    useUniqueFileName: false,
                }
            });

            onChange(uploadResponse.url);
            resetFileInput();
        } catch (error) {
            handleUploadError(error);
        } finally {
            setIsUploading(false);
            setProgress(0);
            abortControllerRef.current = null;
        }
    };

    const handleUploadError = (error: unknown) => {
        if (error instanceof ImageKitAbortError) {
            console.log("Upload cancelled");
            return;
        }

        const errorMessage =
            error instanceof ImageKitInvalidRequestError ? `Invalid request: ${error.message}` :
                error instanceof ImageKitUploadNetworkError ? `Network error: ${error.message}` :
                    error instanceof ImageKitServerError ? `Server error: ${error.message}` :
                        `Upload failed: ${(error as Error).message}`;

        setError(errorMessage);
        onChange(undefined);
        resetFileInput();
    };

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemove = () => {
        if (isUploading && abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        onChange(undefined);
        resetFileInput();
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {value ? (
                <div className="relative group">
                    <Image
                        src={value}
                        alt="Uploaded content"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover w-full max-h-80"
                        loading="lazy"
                        onError={() => {
                            setError("Ошибка загрузки изображения");
                            handleRemove();
                        }}
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex gap-2 w-full items-end">
                        <Input
                            type="file"
                            ref={fileInputRef}
                            className="shadow-none cursor-pointer"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={isUploading}
                        />
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            variant={'outline'}
                            size={'icon'}
                        >
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageUpload;