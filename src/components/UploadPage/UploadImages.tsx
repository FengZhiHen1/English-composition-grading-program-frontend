import React, { useEffect, useState } from 'react';
import { Upload, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    maxSize?: number;
}

const UploadImages: React.FC<Props> = ({ files, setFiles, maxSize = 10 * 1024 * 1024 }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        const incoming: File[] = Array.from(fileList);
        for (const f of incoming) {
            if (!f.type || !f.type.startsWith('image/')) {
                alert('只能上传图片文件（image/*）');
                return;
            }
            if (f.size > maxSize) {
                alert(`单张图片大小不能超过 ${maxSize / (1024 * 1024)}MB`);
                return;
            }
        }

        setFiles(prev => [...prev, ...incoming]);
        e.currentTarget.value = '';
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewIndex(prevIdx => {
            if (prevIdx === null) return prevIdx;
            if (prevIdx === index) return null;
            if (prevIdx > index) return prevIdx - 1;
            return prevIdx;
        });
    };

    const openPreview = (index: number) => setPreviewIndex(index);
    const closePreview = () => setPreviewIndex(null);
    const prevPreview = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (previewIndex === null) return;
        setPreviewIndex((previewIndex - 1 + previews.length) % previews.length);
    };
    const nextPreview = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (previewIndex === null) return;
        setPreviewIndex((previewIndex + 1) % previews.length);
    };

    useEffect(() => {
        const old = previews.slice();
        const newPreviews = files.map(f => URL.createObjectURL(f));
        setPreviews(newPreviews);
        old.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
        return () => { newPreviews.forEach(u => { try { URL.revokeObjectURL(u); } catch {} }); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                上传图片
            </label>
            <div className="relative group">
                <input
                    id="upload-page-file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                    title=""
                />

                <label
                    htmlFor="upload-page-file-input"
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all ${
                        files.length > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex gap-3 text-gray-400 mb-1">
                        <ImageIcon size={20} />
                        <Upload size={20} />
                    </div>
                    <p className="text-gray-600 font-medium text-sm">点击上传图片</p>
                    <p className="text-[10px] text-gray-400">仅支持图片格式 (jpg, png, gif 等)，单张不超过 {maxSize / 1024 / 1024}MB</p>
                    {files.length > 0 && <p className="text-[10px] text-blue-500 mt-2">已选择 {files.length} 张图片，点击区域可继续添加</p>}
                </label>

                {files.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2 max-h-40 overflow-auto">
                        {files.map((f, idx) => (
                            <div
                                key={idx}
                                className="relative flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-100"
                            >
                                {/* 左侧：可收缩的文件信息区，保证名称溢出时不会把按钮挤出屏幕 */}
                                <div
                                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                                    onClick={() => openPreview(idx)}
                                >
                                    <ImageIcon size={18} className="text-gray-500" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-700 truncate">{f.name}</p>
                                        <p className="text-[11px] text-gray-400">({(f.size / 1024 / 1024).toFixed(2)} MB)</p>
                                    </div>
                                </div>

                                {/* 右侧：固定不会收缩的移除按钮，始终可见 */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                    className="flex-shrink-0 ml-3 text-red-500 hover:text-red-600 p-2 rounded"
                                    title="移除"
                                    aria-label={`移除 ${f.name}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {previewIndex !== null && previews[previewIndex] && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closePreview}>
                        <div className="relative max-w-[90%] max-h-[90%]">
                            <img
                                src={previews[previewIndex]}
                                alt={files[previewIndex]?.name || 'preview'}
                                className="max-w-full max-h-[80vh] rounded-md shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); closePreview(); }}
                                className="absolute top-2 right-2 bg-black/50 rounded-full p-2 text-white"
                                title="关闭"
                            >
                                <X size={18} />
                            </button>

                            {previews.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPreview}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
                                        title="上一张"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextPreview}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white"
                                        title="下一张"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadImages;