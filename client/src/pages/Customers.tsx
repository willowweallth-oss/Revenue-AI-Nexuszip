import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Customers() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground">Customers</h1>
        <p className="text-muted-foreground">Manage and view all your customer accounts.</p>
      </div>

      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Customer management coming soon...</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
