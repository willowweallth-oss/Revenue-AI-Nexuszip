import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Conversations() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground">Conversations</h1>
        <p className="text-muted-foreground">View and manage all historical lead interactions.</p>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="text-center py-12">
          <div className="bg-primary/10 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="size-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-display">Conversation History</CardTitle>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            This page will show a searchable history of all conversations. For real-time chatting, please use the Smart Inbox.
          </p>
        </CardHeader>
        <CardContent className="flex justify-center pb-12">
          <Link href="/inbox">
            <Button variant="outline" className="rounded-xl">Go to Smart Inbox</Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}