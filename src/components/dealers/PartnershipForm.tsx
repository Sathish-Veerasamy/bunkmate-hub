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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Partner {
  id: string;
  name: string;
  contact: string;
  email: string;
  emergencyContact?: string;
  aadharNumber?: string;
  dateOfBirth?: string;
  education?: string;
  gender?: string;
  bloodGroup?: string;
}

interface PartnershipFormProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
  defaultValues?: any;
}

export default function PartnershipForm({ onSubmit, onBack, defaultValues }: PartnershipFormProps) {
  const [partners, setPartners] = useState<Partner[]>(
    defaultValues?.partners || [{ id: crypto.randomUUID(), name: "", contact: "", email: "" }]
  );

  const addPartner = () => {
    setPartners([...partners, { id: crypto.randomUUID(), name: "", contact: "", email: "" }]);
  };

  const removePartner = (id: string) => {
    if (partners.length > 1) {
      setPartners(partners.filter((p) => p.id !== id));
    }
  };

  const updatePartner = (id: string, field: string, value: string) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ partners });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Step 2: Partnership Details</h3>
        <p className="text-sm text-muted-foreground">Add all partners information</p>
      </div>

      <div className="space-y-4">
        {partners.map((partner, index) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Partner {index + 1}</CardTitle>
                {partners.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePartner(partner.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Partner Name */}
                <div className="space-y-2">
                  <Label>Name of Partner *</Label>
                  <Input
                    required
                    value={partner.name}
                    onChange={(e) => updatePartner(partner.id, "name", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <Label>Contact No *</Label>
                  <Input
                    required
                    value={partner.contact}
                    onChange={(e) => updatePartner(partner.id, "contact", e.target.value)}
                    placeholder="9876543210"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>E-Mail *</Label>
                  <Input
                    required
                    type="email"
                    value={partner.email}
                    onChange={(e) => updatePartner(partner.id, "email", e.target.value)}
                    placeholder="partner@example.com"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  <Input
                    value={partner.emergencyContact || ""}
                    onChange={(e) => updatePartner(partner.id, "emergencyContact", e.target.value)}
                    placeholder="9876543211"
                  />
                </div>

                {/* Aadhar Number */}
                <div className="space-y-2">
                  <Label>Aadhar Number</Label>
                  <Input
                    value={partner.aadharNumber || ""}
                    onChange={(e) => updatePartner(partner.id, "aadharNumber", e.target.value)}
                    placeholder="1234 5678 9012"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={partner.dateOfBirth || ""}
                    onChange={(e) => updatePartner(partner.id, "dateOfBirth", e.target.value)}
                  />
                </div>

                {/* Education Qualification */}
                <div className="space-y-2">
                  <Label>Education Qualification</Label>
                  <Input
                    value={partner.education || ""}
                    onChange={(e) => updatePartner(partner.id, "education", e.target.value)}
                    placeholder="Enter qualification"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={partner.gender || ""}
                    onValueChange={(value) => updatePartner(partner.id, "gender", value)}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id={`male-${partner.id}`} />
                        <Label htmlFor={`male-${partner.id}`} className="font-normal">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id={`female-${partner.id}`} />
                        <Label htmlFor={`female-${partner.id}`} className="font-normal">
                          Female
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Blood Group */}
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={partner.bloodGroup || ""}
                    onValueChange={(value) => updatePartner(partner.id, "bloodGroup", value)}
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
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addPartner} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Another Partner
        </Button>
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
