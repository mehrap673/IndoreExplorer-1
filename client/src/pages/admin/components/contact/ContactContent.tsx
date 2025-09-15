import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ContactMessage } from "../../types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import ContactMessageView from "./ContactMessageView";

export default function ContactContent() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"],
    queryFn: async () => {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to mark message as read");
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const response = await fetch(`/api/contact/${id}/reply`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ reply }),
      });
      if (!response.ok) throw new Error("Failed to send reply");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setSelectedMessage(null);
    },
  });

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !message.isRead) ||
      (statusFilter === "read" && message.isRead && !message.isReplied) ||
      (statusFilter === "replied" && message.isReplied);
    return matchesSearch && matchesStatus;
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsReadMutation.mutate(message._id);
    }
  };

  const handleReply = (reply: string) => {
    if (selectedMessage) {
      replyMutation.mutate({ id: selectedMessage._id, reply });
    }
  };

  if (selectedMessage) {
    return (
      <ContactMessageView
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onReply={handleReply}
        isReplying={replyMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-messages"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                data-testid="select-message-status-filter"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "No messages match your filters"
                : "No contact messages found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Subject</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((message) => (
                    <tr
                      key={message._id}
                      className={`border-b border-border hover:bg-muted ${
                        !message.isRead ? "font-bold bg-muted/50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex gap-2">
                          {!message.isRead && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          {message.isReplied && (
                            <Badge variant="default" className="text-xs">
                              Replied
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">{message.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{message.email}</td>
                      <td className="p-4">
                        <p className="truncate max-w-xs">{message.subject}</p>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                          data-testid={`button-view-message-${message._id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}