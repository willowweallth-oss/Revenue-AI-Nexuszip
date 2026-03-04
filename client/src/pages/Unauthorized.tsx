import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "wouter";

export default function Unauthorized() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md mx-4 rounded-2xl border-border/50 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            If you believe this is an error, please contact your administrator.
          </p>
          <Link href="/">
            <Button className="w-full rounded-xl">
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
