import type { ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
        <label
          htmlFor="file-upload"
          className="relative block border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center h-80 flex flex-col items-center justify-center group hover:border-primary transition-colors cursor-pointer"
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
              <div className="relative z-10 space-y-4">
                <div className="flex justify-center">
                    <div className="bg-primary/10 p-4 rounded-full border-4 border-primary/20">
                        <UploadCloud className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <p className="text-muted-foreground">
                  Drag & drop your prescription image here, or{' '}
                  <span className="text-primary font-semibold hover:underline">
                    browse files
                  </span>
                </p>
                <div className="flex items-center justify-center text-muted-foreground text-sm">
                  <Camera className="h-4 w-4 mr-2" />
                  You can also use your device's camera
                </div>
              </div>
            </>
          )}
          <Input 
            id="file-upload"
            type="file" 
            accept="image/*" 
            capture="environment"
            className="sr-only" 
            onChange={onFileChange}
          />
        </label>
      </CardContent>
    </Card>
  );
}
