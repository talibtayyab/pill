import type { ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

interface PrescriptionUploaderProps {
  preview: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}

export function PrescriptionUploader({ preview, onFileChange, onDrop }: PrescriptionUploaderProps) {
  const bgImage = PlaceHolderImages.find(img => img.id === 'prescription-upload-bg');

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-0">
        <div
          className="relative block border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center h-80 flex flex-col items-center justify-center group transition-colors"
          onDrop={onDrop}
          onDragOver={handleDragOver}
        >
          {preview ? (
            <Image 
              src={preview} 
              alt="Prescription preview" 
              fill 
              className="object-contain rounded-lg p-2"
            />
          ) : (
            <>
              {bgImage && (
                <Image
                  src={bgImage.imageUrl}
                  alt={bgImage.description}
                  fill
                  className="object-cover opacity-10 group-hover:opacity-20 transition-opacity"
                  data-ai-hint={bgImage.imageHint}
                />
              )}
              <div className="relative z-10 space-y-4 flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full border-4 border-primary/20">
                    <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground max-w-xs">
                  Drag & drop your prescription image here, or use one of the options below.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                   <Button asChild variant="outline" className="cursor-pointer">
                      <label htmlFor="browse-upload">
                        Browse Files
                      </label>
                   </Button>
                   <Button asChild className="cursor-pointer">
                       <label htmlFor="camera-upload">
                         <Camera className="mr-2 h-4 w-4" />
                         Capture with Camera
                       </label>
                   </Button>
                </div>
              </div>
            </>
          )}
          <Input 
            id="browse-upload"
            type="file" 
            accept="image/*" 
            className="sr-only" 
            onChange={onFileChange}
          />
           <Input 
            id="camera-upload"
            type="file" 
            accept="image/*" 
            capture="environment"
            className="sr-only" 
            onChange={onFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
