import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

// Step 1: Initial registration schema
const initSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email_id: z.string().email("Invalid email address"),
});

// Step 2: OTP verification schema
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Step 3: Complete registration schema
const completeSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type InitFormData = z.infer<typeof initSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type CompleteFormData = z.infer<typeof completeSchema>;

type Step = "init" | "otp" | "complete" | "success";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("init");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const initForm = useForm<InitFormData>({
    resolver: zodResolver(initSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email_id: "",
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const completeForm = useForm<CompleteFormData>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const handleInit = async (values: InitFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.registerInit({
        first_name: values.first_name,
        last_name: values.last_name,
        email_id: values.email_id,
      });
      
      if (response.success) {
        setUserData({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email_id,
        });
        setStep("otp");
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: response.error || "Failed to initiate registration",
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

  const handleOtpVerify = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.verifyOtp({
        email: userData.email,
        otp: data.otp,
      });
      
      if (response.success) {
        setStep("complete");
        toast({
          title: "OTP Verified",
          description: "Please set your password to complete registration.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: response.error || "Invalid OTP",
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

  const handleComplete = async (data: CompleteFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.registerComplete({
        email: userData.email,
        password: data.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
      
      if (response.success) {
        setStep("success");
        toast({
          title: "Registration complete",
          description: "Your account has been created successfully!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: response.error || "Failed to complete registration",
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
      const response = await authAPI.registerInit({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email_id: userData.email,
      });
      
      if (response.success) {
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to resend",
          description: response.error || "Please try again later",
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
      { key: "init", label: "Details" },
      { key: "otp", label: "Verify" },
      { key: "complete", label: "Password" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentIndex
                  ? "bg-primary text-primary-foreground"
                  : index === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentIndex ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  index < currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              {step === "success" ? "Registration Complete!" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {step === "init" && "Enter your details to get started"}
              {step === "otp" && `Enter the code sent to ${userData.email}`}
              {step === "complete" && "Set a strong password for your account"}
              {step === "success" && "You can now sign in to your account"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {step !== "success" && getStepIndicator()}

          {/* Step 1: Initial Details */}
          {step === "init" && (
            <Form {...initForm}>
              <form onSubmit={initForm.handleSubmit(handleInit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={initForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={initForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={initForm.control}
                  name="email_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpVerify)} className="space-y-4">
                <FormField
                  control={otpForm.control}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep("init")}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={resendOtp}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Step 3: Complete Registration */}
          {step === "complete" && (
            <Form {...completeForm}>
              <form onSubmit={completeForm.handleSubmit(handleComplete)} className="space-y-4">
                <FormField
                  control={completeForm.control}
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
                  control={completeForm.control}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Registration
                </Button>
              </form>
            </Form>
          )}

          {/* Success State */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Your account has been created successfully. You can now sign in with your credentials.
              </p>
              <Button className="w-full" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </div>
          )}

          {step !== "success" && (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
