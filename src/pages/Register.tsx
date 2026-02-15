import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Eye, EyeOff, Loader2, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

// Combined registration schema
const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email_id: z.string().email("Invalid email address"),
  otp: z.string().optional(),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
}).refine((data) => {
  // Only validate password match when both are provided
  if (data.password && data.confirm_password) {
    return data.password === data.confirm_password;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

type Step = "details" | "otp" | "password" | "success";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("details");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email_id: "",
      otp: "",
      password: "",
      confirm_password: "",
    },
  });

  const handleSendOtp = async () => {
    const isValid = await form.trigger(["first_name", "last_name", "email_id"]);
    if (!isValid) return;

    setIsLoading(true);
    try {
      const values = form.getValues();
      const result = await authAPI.registerInit({
        first_name: values.first_name,
        last_name: values.last_name,
        email_id: values.email_id,
      });

      if (result.success) {
        setStep("otp");
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = form.getValues("otp");
    if (!otp || otp.length !== 6) {
      form.setError("otp", { message: "OTP must be 6 digits" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authAPI.verifyOtp({
        email_id: form.getValues("email_id"),
        otp: otp,
      });

      if (result.success) {
        setIsEmailVerified(true);
        setStep("password");
        toast({
          title: "Email Verified",
          description: "Please set your password to complete registration.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    const password = form.getValues("password");
    const confirmPassword = form.getValues("confirm_password");

    if (!password || password.length < 8) {
      form.setError("password", { message: "Password must be at least 8 characters" });
      return;
    }

    if (password !== confirmPassword) {
      form.setError("confirm_password", { message: "Passwords don't match" });
      return;
    }

    setIsLoading(true);
    try {
      const values = form.getValues();
      const result = await authAPI.completeRegister({
        email_id: values.email_id,
        password: values.password!,
        first_name: values.first_name,
        last_name: values.last_name,
      });

      if (result.success) {
        setStep("success");
        toast({
          title: "Registration Complete",
          description: "Your account has been created successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      const values = form.getValues();
      const result = await authAPI.registerInit({
        first_name: values.first_name,
        last_name: values.last_name,
        email_id: values.email_id,
      });

      if (result.success) {
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to resend OTP. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndicator = () => {
    const steps = [
      { key: "details", label: "Details", number: 1 },
      { key: "otp", label: "Verify", number: 2 },
      { key: "password", label: "Password", number: 3 },
    ];

    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index < currentIndex
                  ? "bg-primary text-primary-foreground"
                  : index === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentIndex ? "✓" : s.number}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 transition-colors ${
                  index < currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Registration Complete!</CardTitle>
              <CardDescription>
                You can now sign in to your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Your account has been created successfully. You can now sign in with your credentials.
            </p>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              {step === "details" && "Enter your details to get started"}
              {step === "otp" && "Verify your email address"}
              {step === "password" && "Set a strong password to complete"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {getStepIndicator()}

          <Form {...form}>
            <div className="space-y-4">
              {/* Personal Details - Always visible but disabled after OTP sent */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John" 
                          {...field} 
                          disabled={step !== "details"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Doe" 
                          {...field} 
                          disabled={step !== "details"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          {...field} 
                          disabled={step !== "details"}
                        />
                        {isEmailVerified && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Send OTP Button - Only visible in details step */}
              {step === "details" && (
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Code
                </Button>
              )}

              {/* OTP Section - Visible in OTP step */}
              {step === "otp" && (
                <div className="space-y-4 pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Code
                  </Button>
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={resendOtp}
                      disabled={isLoading}
                    >
                      Didn't receive code? Resend OTP
                    </Button>
                  </div>
                </div>
              )}

              {/* Password Section - Visible after email verification */}
              {step === "password" && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-2 rounded-md">
                    <CheckCircle className="h-4 w-4" />
                    <span>Email verified successfully</span>
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={handleCompleteRegistration}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
