import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { readMyKeyApiV1ClientMeGet } from "@/client/sdk.gen";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setError("Please enter an API Key");
      setIsLoading(false);
      return;
    }

    try {
      // Temporarily set it so the interceptor picks it up
      localStorage.setItem("apiKey", trimmedKey);

      const { data, error: apiError } = await readMyKeyApiV1ClientMeGet();

      if (apiError || !data) {
        localStorage.removeItem("apiKey");
        setError("Invalid API Key");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      localStorage.removeItem("apiKey");
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/40 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <Card className="shadow-lg border-muted">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Enter your API Key to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 flex flex-col items-start w-full">
                <label
                  htmlFor="apiKey"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="API_KEY_HERE"
                  autoComplete="off"
                  disabled={isLoading}
                  required
                />
                {error && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {error}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Sign In"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
