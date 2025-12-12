"use client";

    import { useState } from "react";
    import { useFormContext, useWatch } from "react-hook-form";
    import { ImageIcon, Loader2, UploadCloud, Plus, Trash, GripVertical } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
    import { Badge } from "@/components/ui/badge";
    import { toast } from "sonner";
    import { api } from "@/lib/api";
    import { styles } from "./constants";

    import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    } from "@dnd-kit/core";
    import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
    } from "@dnd-kit/sortable";
    import { CSS } from "@dnd-kit/utilities";

    const fixImageSource = (url: string | undefined | null) => {
    if (!url || url === "") return "/placeholder.jpg";
    if (url.startsWith("/")) return url;
    if (
        process.env.NODE_ENV === "production" &&
        (url.includes("localhost") || url.includes("127.0.0.1"))
    ) {
        return url.replace(
        /http:\/\/(localhost|127\.0\.0\.1):\d+/g,
        "https://98.93.10.61.nip.io"
        );
    }
    return url;
    };

    function SortablePhoto({ url, id, index, onRemove, onSetCover, isCover }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <div
        ref={setNodeRef}
        style={style}
        // ANTES: bg-black border-[#333]
        // DEPOIS: bg-card border-border
        className="relative aspect-square w-[150px] group bg-card rounded-md overflow-hidden border border-border"
        >
        <img
            src={fixImageSource(url)}
            alt={`Foto ${index}`}
            className="w-full h-full object-cover pointer-events-none select-none"
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <div {...attributes} {...listeners} className="absolute top-2 left-2 cursor-grab active:cursor-grabbing text-white p-1 hover:bg-white/20 rounded">
            <GripVertical size={16} />
            </div>

            <button type="button" onClick={() => onRemove(index)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors">
            <Trash size={12} />
            </button>

            {!isCover && (
            // ANTES: hover:text-[#d4af37]
            // DEPOIS: hover:text-primary
            <Button type="button" variant="ghost" size="sm" className="text-xs text-white hover:text-primary mt-4" onClick={() => onSetCover(index)}>
                Definir Capa
            </Button>
            )}
        </div>

        {/* ANTES: bg-[#d4af37] text-black */}
        {/* DEPOIS: bg-primary text-primary-foreground */}
        {isCover && <Badge className="absolute bottom-2 right-2 text-[9px] px-2 bg-primary text-primary-foreground font-bold shadow-md z-10 pointer-events-none">CAPA</Badge>}
        <div className="absolute bottom-2 left-2 text-[10px] text-white/50 font-mono pointer-events-none">#{index + 1}</div>
        </div>
    );
    }

    export function MediaStep() {
    const { control, setValue, getValues } = useFormContext();
    const images = useWatch({ control, name: "images" }) || [];
    
    const [tempImageUrl, setTempImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onDragEndImages = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = images.findIndex((img: any) => img.url === active.id);
            const newIndex = images.findIndex((img: any) => img.url === over?.id);
            
            const newImages = arrayMove(images, oldIndex, newIndex);
            
            const finalImages = newImages.map((img: any, idx: number) => ({
                ...img,
                isCover: idx === 0
            }));
            
            setValue("images", finalImages, { shouldDirty: true });
        }
    };

    const addImage = () => {
        if (!tempImageUrl) return;
        setValue("images", [...images, { url: tempImageUrl, isCover: images.length === 0 }]);
        setTempImageUrl("");
    };
    
    const removeImage = (idx: number) => { 
        const filtered = images.filter((_: any, i: number) => i !== idx); 
        const updated = filtered.map((img: any, i: number) => ({ ...img, isCover: i === 0 })); 
        setValue("images", updated, { shouldDirty: true }); 
    };
    
    const setCover = (idx: number) => {
        const newImages = [...images];
        const [selected] = newImages.splice(idx, 1);
        newImages.unshift(selected);
        const updated = newImages.map((img: any, i: number) => ({ ...img, isCover: i === 0 }));
        setValue("images", updated, { shouldDirty: true });
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = async (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const files = Array.from(e.dataTransfer.files); await uploadFiles(files); };
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { const files = Array.from(e.target.files); await uploadFiles(files); } };
    
    const uploadFiles = async (files: File[]) => { 
        if (files.length === 0) return; 
        setIsUploading(true); 
        const formData = new FormData(); 
        files.forEach(file => { if (file.type.startsWith('image/')) { formData.append('files', file); } }); 
        try { 
            const { data } = await api.post('/properties/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); 
            const newImages = data.map((img: { url: string }) => ({ url: img.url, isCover: false })); 
            
            const currentImages = getValues('images') || [];
            const combined = [...currentImages, ...newImages].map((img: any, i: number) => ({ ...img, isCover: i === 0 }));
            
            setValue('images', combined, { shouldDirty: true }); 
            toast.success(`${newImages.length} imagens adicionadas!`); 
        } catch (error) { toast.error("Erro upload."); } finally { setIsUploading(false); } 
    };

    return (
        <Card className={styles.sectionClass}>
        <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-primary flex items-center gap-2 text-base">
            <ImageIcon size={18} /> MULTIMÍDIA
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={control}
                name="videoUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className={styles.labelClass}>Vídeo (YouTube)</FormLabel>
                    <FormControl>
                    <Input {...field} className={styles.inputClass} />
                    </FormControl>
                </FormItem>
                )}
            />
            <FormField
                control={control}
                name="tourUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className={styles.labelClass}>Tour 360</FormLabel>
                    <FormControl>
                    <Input {...field} className={styles.inputClass} />
                    </FormControl>
                </FormItem>
                )}
            />
            </div>

            <div className="space-y-4">
            <p className={styles.labelClass}>Galeria de Fotos (Arraste para organizar)</p>
            
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                // ANTES: border-[#444] bg-[#252525]
                // DEPOIS: border-input bg-muted/20
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                    ? "border-primary bg-primary/10"
                    : "border-input bg-muted/20 hover:border-primary/50"
                }`}
            >
                <input type="file" multiple accept="image/*" className="hidden" id="image-upload" onChange={handleFileSelect} />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                {isUploading ? (
                    <>
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground font-medium">Enviando imagens...</p>
                    </>
                ) : (
                    <>
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                    <p className="text-foreground font-medium text-lg">Arraste e solte imagens aqui</p>
                    <p className="text-muted-foreground text-sm mt-2">ou clique para selecionar</p>
                    <Button type="button" variant="outline" className="mt-4 border-input text-muted-foreground hover:text-foreground hover:border-foreground">
                        Selecionar Arquivos
                    </Button>
                    </>
                )}
                </label>
            </div>

            <div className="flex gap-2">
                <Input
                placeholder="Cole o link da imagem..."
                value={tempImageUrl}
                onChange={(e) => setTempImageUrl(e.target.value)}
                className={styles.inputClass}
                />
                <Button type="button" onClick={addImage} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus size={16} />
                </Button>
            </div>

            {images && images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndImages}>
                <SortableContext items={images.map((i: any) => i.url)} strategy={rectSortingStrategy}>
                    {/* ANTES: bg-[#151515] border-[#333] */}
                    {/* DEPOIS: bg-muted/30 border-border */}
                    <div className="flex flex-wrap gap-4 mt-4 bg-muted/30 p-4 rounded border border-border">
                        {images.map((img: any, index: number) => (
                            <SortablePhoto 
                            key={img.url} 
                            url={img.url} 
                            id={img.url}
                            index={index} 
                            onRemove={removeImage} 
                            onSetCover={setCover}
                            isCover={index === 0}
                            />
                        ))}
                    </div>
                </SortableContext>
                </DndContext>
            )}
            </div>
        </CardContent>
        </Card>
    );
    }