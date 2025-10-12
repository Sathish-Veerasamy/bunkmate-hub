import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";

interface ProprietorFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  defaultValues?: any;
}

export default function ProprietorForm({ onSubmit, onBack, defaultValues }: ProprietorFormProps) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Step 2: Proprietor Details</h3>
        <p className="text-sm text-muted-foreground">Enter owner/incharge details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Name */}
        <div className="space-y-2">
          <Label htmlFor="ownerName">Name of Owner/Incharge *</Label>
          <Input
            id="ownerName"
            {...register("ownerName", { required: true })}
            placeholder="Enter full name"
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="ownerContact">Contact No *</Label>
          <Input
            id="ownerContact"
            {...register("ownerContact", { required: true })}
            placeholder="9876543210"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="ownerEmail">E-Mail *</Label>
          <Input
            id="ownerEmail"
            type="email"
            {...register("ownerEmail", { required: true })}
            placeholder="owner@example.com"
          />
        </div>

        {/* Emergency Contact */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            {...register("emergencyContact")}
            placeholder="9876543211"
          />
        </div>

        {/* Aadhar Number */}
        <div className="space-y-2">
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <Input
            id="aadharNumber"
            {...register("aadharNumber")}
            placeholder="1234 5678 9012"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
        </div>

        {/* Education Qualification */}
        <div className="space-y-2">
          <Label htmlFor="education">Education Qualification</Label>
          <Input
            id="education"
            {...register("education")}
            placeholder="Enter qualification"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            defaultValue={defaultValues?.gender}
            onValueChange={(value) => setValue("gender", value)}
          >
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="male" />
                <Label htmlFor="male" className="font-normal">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="female" />
                <Label htmlFor="female" className="font-normal">
                  Female
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select
            defaultValue={defaultValues?.bloodGroup}
            onValueChange={(value) => setValue("bloodGroup", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sticky Footer with Buttons */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-card p-6 flex justify-center gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit">Submit Application</Button>
      </div>
    </form>
  );
}
