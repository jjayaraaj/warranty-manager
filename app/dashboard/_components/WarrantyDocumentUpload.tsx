'use client'
import React, { useState, ChangeEvent } from 'react';
import Tesseract, { createWorker } from 'tesseract.js';
import { Upload, Scan, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,

} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExtractedWarrantyData, OCRProgressStatus } from '@/types/ui/warranty';

interface WarrantyDocumentUploadProps {
  onProcessComplete: (data: ExtractedWarrantyData) => void;
  onError?: (error: Error) => void;
}

 const WarrantyDocumentUpload: React.FC<WarrantyDocumentUploadProps> = ({ 
  onProcessComplete,
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'scan'>('upload');

  const extractWarrantyInfo = (text: string): ExtractedWarrantyData => {
    const patterns: Record<keyof ExtractedWarrantyData, RegExp> = {
      serialNumber: /(?:serial[^\d]*|s\/n:?)[^\d]*(\w{4,})/i,
      modelNumber: /(?:model[^\d]*|m\/n:?)[^\d]*(\w{4,})/i,
      price: /(?:price|total|amount):?\s*[$]?\s*(\d+(?:\.\d{2})?)/i,
      date: /(?:\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})|(?:\w+ \d{1,2},? \d{4})/i,
      brand: /(?:brand|manufacturer|made by):?\s*([A-Za-z]+(?:\s[A-Za-z]+)?)/i,
      productName: /(?:product|item|name):?\s*([A-Za-z0-9]+(?:\s[A-Za-z0-9]+){0,3})/i,
      retailerName: /(?:retailer|store|seller):?\s*([A-Za-z]+(?:\s[A-Za-z]+)?)/i,
      retailerContact: /(?:contact|phone|tel):?\s*((?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i
    };

    const extracted: Partial<ExtractedWarrantyData> = {};
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match) {
        extracted[key as keyof ExtractedWarrantyData] = match[1];
      }
    });

    return extracted;
  };

//   const worker :any = createWorker({
//     logger: (m: any) => console.log(m),
//   }as any);



  const processImage = async (file: string | File): Promise<void> => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText('Initializing OCR...');
  
    try {
      // Create worker with a simpler logger that doesn't include functions

      const worker: any = await createWorker();

      let imageData = file;
      if (file instanceof File) {
        imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      try {
        setStatusText('Loading OCR core...');
        await worker.load();
        
        setStatusText('Loading language data...');
        await worker.loadLanguage('eng');
        
        setStatusText('Initializing OCR...');
        await worker.initialize('eng');
        
        setStatusText('Processing image...');
        const { data} = await worker.recognize(imageData);
        
        // Extract warranty information
        const extractedData = extractWarrantyInfo(data.text);
        
        setStatusText('Processing complete!');
        onProcessComplete(extractedData);
      } finally {
        // Make sure we always terminate the worker
        await worker.terminate();
      }
    } catch (error) {
      console.error('Error processing document:', error);
      setStatusText('Error processing document');
      if (error instanceof Error && onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusText('Please upload an image file');
      return;
    }
    
    const fileUrl = URL.createObjectURL(file);
    await processImage(fileUrl);
    URL.revokeObjectURL(fileUrl);
  };

  const handleScanComplete = async (scannedImage: string | null): Promise<void> => {
    if (scannedImage) {
      await processImage(scannedImage);
    }
  };

  const initializeCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      // Implementation for camera handling would go here
      // You might want to show a video preview and add capture functionality
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error instanceof Error && onError) {
        onError(error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Scan or Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add warranty document</DialogTitle>
          <DialogDescription>
            Upload a receipt or warranty document to automatically fill in the details
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={()=>setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="scan">
              <Scan className="mr-2 h-4 w-4" />
              Scan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload clear images of receipts or warranty documents
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scan">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    disabled={isProcessing}
                    onClick={initializeCamera}
                  >
                    <Scan className="mr-2 h-4 w-4" />
                    Start Scanning
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Position the document within the camera frame
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {isProcessing && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">{statusText}</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WarrantyDocumentUpload;