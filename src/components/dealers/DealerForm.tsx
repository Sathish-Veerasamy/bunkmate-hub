import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import ProprietorForm from "./ProprietorForm";
import PartnershipForm from "./PartnershipForm";
import LimitedForm from "./LimitedForm";

interface DealerFormProps {
  dealer?: any;
  onClose: () => void;
}

export default function DealerForm({ dealer, onClose }: DealerFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [bunkData, setBunkData] = useState<any>(dealer || {});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: dealer || {},
  });

  const constitution = watch("constitution");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onBunkDetailsSubmit = (data: any) => {
    if (!data.constitution) {
      toast({
        title: "Constitution Required",
        description: "Please select the constitution type to proceed.",
        variant: "destructive",
      });
      return;
    }
    setBunkData({ ...bunkData, ...data, uploadedFiles });
    setStep(2);
  };

  const onFinalSubmit = (userData: any) => {
    const finalData = { ...bunkData, ...userData };
    console.log("Final form data:", finalData);
    toast({
      title: dealer ? "Dealer Updated" : "Dealer Added",
      description: dealer
        ? "Dealer information has been updated successfully."
        : "New dealer has been added successfully.",
    });
    onClose();
  };

  const handleBack = () => {
    setStep(1);
  };

  if (step === 2) {
    if (constitution === "Proprietor") {
      return <ProprietorForm onSubmit={onFinalSubmit} onBack={handleBack} defaultValues={bunkData} />;
    } else if (constitution === "Partnership") {
      return <PartnershipForm onSubmit={onFinalSubmit} onBack={handleBack} defaultValues={bunkData} />;
    } else if (constitution === "Limited") {
      return <LimitedForm onSubmit={onFinalSubmit} onBack={handleBack} defaultValues={bunkData} />;
    }
  }

  return (
    <form onSubmit={handleSubmit(onBunkDetailsSubmit)} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Step 1: Bunk Details</h3>
        <p className="text-sm text-muted-foreground">Enter the dealership information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dealership Name */}
        <div className="space-y-2">
          <Label htmlFor="dealershipName">Name of Dealership *</Label>
          <Input
            id="dealershipName"
            {...register("dealershipName", { required: true })}
            placeholder="Enter dealership name"
          />
        </div>

        {/* Name of Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Name of Company *</Label>
          <Select
            defaultValue={dealer?.company}
            onValueChange={(value) => setValue("company", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IOC">IOC</SelectItem>
              <SelectItem value="BPC">BPC</SelectItem>
              <SelectItem value="HPC">HPC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            {...register("address", { required: true })}
            placeholder="Enter complete address"
            rows={2}
          />
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" {...register("pincode")} placeholder="624001" />
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            {...register("district")}
            placeholder="Enter district"
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="contact">Contact No *</Label>
          <Input
            id="contact"
            {...register("contact", { required: true })}
            placeholder="9876543210"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
            placeholder="dealer@example.com"
          />
        </div>

        {/* Status of Dealership */}
        <div className="space-y-2">
          <Label>Status of Dealership *</Label>
          <RadioGroup
            defaultValue={dealer?.status}
            onValueChange={(value) => setValue("status", value)}
          >
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sale" id="sale" />
                <Label htmlFor="sale" className="font-normal">
                  Sale
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Dist" id="dist" />
                <Label htmlFor="dist" className="font-normal">
                  Dist
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CRE" id="cre" />
                <Label htmlFor="cre" className="font-normal">
                  CRE
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Constitution */}
        <div className="space-y-2">
          <Label htmlFor="constitution">Constitution *</Label>
          <Select
            defaultValue={dealer?.constitution}
            onValueChange={(value) => setValue("constitution", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select constitution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Proprietor">Proprietor</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Limited">Limited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* GST Number */}
        <div className="space-y-2">
          <Label htmlFor="gstNo">GST No</Label>
          <Input
            id="gstNo"
            {...register("gstNo")}
            placeholder="33XXXXX1234X1Z5"
          />
        </div>

        {/* Date/Year of Establishment */}
        <div className="space-y-2">
          <Label htmlFor="establishedYear">Date/Year of Establishment</Label>
          <Input
            id="establishedYear"
            {...register("establishedYear")}
            placeholder="2020"
          />
        </div>

        {/* Communication Details */}
        <div className="space-y-2">
          <Label htmlFor="officeDetails">Communication Details (Office)</Label>
          <Input
            id="officeDetails"
            {...register("officeDetails")}
            placeholder="Enter office contact details"
          />
        </div>

        {/* Other Activities */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="otherActivities">
            Any other Activities of the Dealer
          </Label>
          <Textarea
            id="otherActivities"
            {...register("otherActivities")}
            placeholder="Describe any other business activities"
            rows={3}
          />
        </div>

        {/* Document Attachments */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="documents">Document Attachments</Label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                id="documents"
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button type="button" variant="outline" size="icon" asChild>
                <label htmlFor="documents" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                </label>
              </Button>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {uploadedFiles.length} file(s) selected
                </p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span className="text-sm truncate flex-1">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Footer with Buttons */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-card p-6 flex justify-center gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
