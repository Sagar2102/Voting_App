import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { LoaderCircle } from "lucide-react";
import { userSignupFormSchema } from "@/utils/formsSchema";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

// Define API Base URL
const BASE_URL = "http://localhost:3001";
const SIGNUP_URL = `${BASE_URL}/user/signup`;

export default function UserSignUpPage() {
  const { toast } = useToast();

  // React Hook Form Setup
  const form = useForm<z.infer<typeof userSignupFormSchema>>({
    resolver: zodResolver(userSignupFormSchema),
    defaultValues: {
      name: "",
      age: "",
      cnicNumber: "",
      password: "",
      mobile: "",
      email: "",
      address: "",
    },
  });

  type ErrorType = {
    response?: {
      status?: number;
      data?: {
        error?: string;
      };
    };
  };

  // Mutation for API Call
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof userSignupFormSchema>) => {
      const formattedValues = {
        ...values,
        age: parseInt(values.age), // Convert age to number
        cnicNumber: parseInt(values.cnicNumber), // Convert CNIC to number
      };

      const res = await axios.post(SIGNUP_URL, formattedValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "User successfully signed up!",
      });
      form.reset();
    },
    onError: (error: ErrorType) => {
      const errorMessage = error.response?.data?.error || "Can't Signup, try again!";
      toast({
        variant: "destructive",
        description: errorMessage,
      });

      if (error.response?.status === 409) {
        toast({
          variant: "destructive",
          description: "User already exists!",
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof userSignupFormSchema>) => {
    mutation.mutate(values);
  };

  return (
    <main className="flex justify-center items-center py-20">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            You can sign up into the e-voting app by filling in these basic details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Masab Bin Zia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Age</FormLabel>
                    <FormControl>
                      <Input placeholder="79" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="randomemail123@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Random Street, SomeCity, SomeCountry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnicNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNIC Number</FormLabel>
                    <FormControl>
                      <Input placeholder="987654321098" {...field} />
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
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {mutation.isError && (
                <p className="text-red-500">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "An unexpected error occurred"}
                </p>
              )}

              <Button type="submit" className="w-full my-4" disabled={mutation.isPending}>
                {mutation.isPending ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
              </Button>
              <Link
                className={`${buttonVariants({
                  variant: "outline",
                })} w-full text-center py-2 rounded-lg`}
                to={"/user-login"}
              >
                Login
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
