import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "http://localhost:3001";
const LOGIN_URL = `${BASE_URL}/user/login`;

const userLoginSchema = z.object({
  cnicNumber: z.string().refine(
    (value) => /^\d{12}$/.test(value),
    { message: "CNIC number must be exactly 12 digits." }
  ),
  password: z.string().min(2, { message: "Enter Correct Password" }),
});

export default function UserLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      cnicNumber: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof userLoginSchema>) => {
      const res = await axios.post(LOGIN_URL, values);
      localStorage.setItem("token", res.data.token);
      return res.data;
    },
    onSuccess: () => {
      toast({ variant: "default", description: "Login Successful." });
      form.reset();
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        description: error?.response?.data?.message || "Login failed! Try again.",
      });
    },
  });

  return (
    <main className="flex justify-center items-center py-20">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your CNIC number and password to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(mutation.mutate)} className="space-y-6">
              <FormField
                control={form.control}
                name="cnicNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNIC Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="button"
                className={`${buttonVariants()} flex items-center gap-2 justify-center`}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
                {showPassword ? "Hide Password" : "Show Password"}
              </button>

              {mutation.isError && (
                <p className="text-red-500">{mutation.error?.response?.data?.message || "An error occurred."}</p>
              )}

              <div className="flex flex-col items-center gap-2">
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <LoaderCircle className="animate-spin" /> : "Login"}
                </Button>
                <Link className={`${buttonVariants({ variant: "outline" })} w-full text-center py-2 rounded-lg`} to="/user-signup">
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
