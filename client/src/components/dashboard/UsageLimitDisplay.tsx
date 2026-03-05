import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface UsageLimitDisplayProps {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

export function UsageLimitDisplay({ label, used, limit, unit = "" }: UsageLimitDisplayProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage > 80;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </CardTitle>
        <span className="text-xs font-bold">
          {used}{unit} / {limit}{unit}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <Progress value={percentage} className="h-1.5" />
      </CardContent>
    </Card>
  );
}
