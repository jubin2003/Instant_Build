import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function LoginForm({ className, ...props }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log({ email, password });
    // Add login logic here
  };

  return (
    <div className={className} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>

              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password">
                    <a className="text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </a>
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Separator */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-4">
                {["Apple", "Google", "Meta"].map((provider) => (
                  <Button
                    key={provider}
                    variant="outline"
                    className="w-full flex items-center justify-center"
                  >
                    <Image
                      src={`/${provider.toLowerCase()}.svg`}
                      alt={`${provider} logo`}
                      width={20}
                      height={20}
                    />
                    <span className="sr-only">Login with {provider}</span>
                  </Button>
                ))}
              </div>

              {/* Sign-Up Link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up">
                  <a className="underline underline-offset-4">Sign up</a>
                </Link>
              </div>
            </div>
          </form>

          {/* Image Section */}
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.svg"
              alt="Login illustration"
              layout="fill"
              objectFit="cover"
              className="dark:opacity-75"
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">
          <a className="underline underline-offset-4">Terms of Service</a>
        </Link>{" "}
        and{" "}
        <Link href="/privacy">
          <a className="underline underline-offset-4">Privacy Policy</a>
        </Link>.
      </div>
    </div>
  );
}
