import React, { useState } from "react";
import { ContactMessage } from "../../types/index";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface ContactMessageViewProps {
  message: ContactMessage;
  onClose: () => void;
  onReply: (reply: string) => void;
  isReplying: boolean;
}

export default function ContactMessageView({
  message,
  onClose,
  onReply,
  isReplying,
}: ContactMessageViewProps) {
  const [reply, setReply] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim()) {
      onReply(reply);
      // Don't clear form immediately, wait for mutation to succeed
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Button>
        <h2 className="text-2xl font-bold">Message Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{message.subject}</CardTitle>
                <div className="flex gap-2">
                  {!message.isRead && <Badge variant="destructive">New</Badge>}
                  {message.isReplied && (
                    <Badge variant="default">Replied</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>

              {message.isReplied && message.reply && (
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">Your Reply:</h4>
                  <div className="bg-primary/10 p-3 rounded">
                    <p className="whitespace-pre-wrap">{message.reply}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Sent on {new Date(message.replyDate!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {!message.isReplied && !showReplyForm && (
                <div className="flex gap-2">
                  <Button onClick={() => setShowReplyForm(true)}>
                    Reply to Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {showReplyForm && !message.isReplied && (
            <Card>
              <CardHeader>
                <CardTitle>Send Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isReplying}>
                      {isReplying ? "Sending..." : "Send Reply"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReplyForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Message Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">From:</Label>
                <p className="font-medium">{message.name}</p>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Date Received:</Label>
                <p className="text-sm">
                  {new Date(message.createdAt).toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status:</Label>
                <div className="flex gap-2 mt-1">
                  <Badge variant={message.isRead ? "secondary" : "destructive"}>
                    {message.isRead ? "Read" : "Unread"}
                  </Badge>
                  {message.isReplied && (
                    <Badge variant="default">Replied</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}