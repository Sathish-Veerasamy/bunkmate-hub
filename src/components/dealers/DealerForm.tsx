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

interface DealerFormProps {
  dealer?: any;
  onClose: () => void;
}

export default function DealerForm({ dealer, onClose }: DealerFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: dealer || {},
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    toast({
      title: dealer ? "Dealer Updated" : "Dealer Added",
      description: dealer
        ? "Dealer information has been updated successfully."
        : "New dealer has been added successfully.",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dealer/Partner Name */}
        <div className="space-y-2">
          <Label htmlFor="dealerName">Name of Dealer/Partner *</Label>
          <Input
            id="dealerName"
            {...register("dealerName", { required: true })}
            placeholder="Enter full name"
          />
        </div>

        {/* Dealership Name */}
        <div className="space-y-2">
          <Label htmlFor="dealershipName">Name of Dealership *</Label>
          <Input
            id="dealershipName"
            {...register("dealershipName", { required: true })}
            placeholder="Enter dealership name"
          />
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
            defaultValue={dealer?.gender}
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
            defaultValue={dealer?.bloodGroup}
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
          <Label htmlFor="constitution">Constitution</Label>
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
              <SelectItem value="Others">Others</SelectItem>
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
      </div>

      {/* Sticky Footer with Buttons */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-card p-6 flex justify-center gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {dealer ? "Update Dealer" : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
