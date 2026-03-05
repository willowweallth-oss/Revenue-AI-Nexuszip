import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Book, MessageCircle, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Help() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">Find answers, read documentation, or contact our support team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate cursor-pointer">
          <CardHeader>
            <Book className="size-8 text-primary mb-2" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Detailed guides on how to use RevAuto AI.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate cursor-pointer">
          <CardHeader>
            <HelpCircle className="size-8 text-emerald-500 mb-2" />
            <CardTitle>FAQs</CardTitle>
            <CardDescription>Quick answers to common questions.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate cursor-pointer">
          <CardHeader>
            <MessageCircle className="size-8 text-amber-500 mb-2" />
            <CardTitle>Community</CardTitle>
            <CardDescription>Join the discussion with other users.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-primary/5">
        <CardHeader className="text-center">
          <LifeBuoy className="size-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl font-display">Still need help?</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Our support team is available 24/7 to assist you with any technical issues or questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button className="rounded-xl px-8">Contact Support</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}