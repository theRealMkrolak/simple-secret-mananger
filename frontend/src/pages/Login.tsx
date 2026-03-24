import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [key, setKey] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      localStorage.setItem("apiKey", key.trim());
      navigate("/dashboard");
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
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="root_admin_secret..."
                  autoComplete="off"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-semibold">
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
