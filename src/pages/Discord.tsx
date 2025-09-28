import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Sidebar } from "@/components/Sidebar";
import { PinnedCard } from "@/components/PinnedCard";
import { MessageList } from "@/components/MessageList";
import { Hash, Users, Pin, Wand2 } from "lucide-react";
import { aiService } from "@/lib/ai";
import { toast } from "@/hooks/use-toast";

export default function Discord() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { channels, messages, selectedChannelId, setSelectedChannel } =
    useStore();

  // Sync URL with state
  useEffect(() => {
    const channelParam = searchParams.get("c");
    if (channelParam && channels.find((c) => c.id === channelParam)) {
      setSelectedChannel(channelParam);
    }
  }, [searchParams, channels, setSelectedChannel]);

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);
  const channelMessages = messages.filter(
    (m) => m.channelId === selectedChannelId
  );

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setSearchParams({ c: channelId });
  };

  const handleStarterKitClick = () => {
    window.location.href = "/welcome";
  };

  const handleAINudge = async () => {
    try {
      const channelId = selectedChannelId || "general";
      const history = messages
        .filter((m) => m.channelId === channelId)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-12)
        .map((m) => `${m.author}: ${m.content}`);
      const suggestion = await aiService.lowPulseSuggestion(history);
      if (suggestion) {
        useStore.getState().postMessage(channelId, {
          id: `nudge-${Date.now()}`,
          channelId,
          author: "PulseBot",
          content: suggestion,
          timestamp: new Date(),
          avatar: "⚡",
        });
        toast({
          title: `AI Nudge posted to #${selectedChannel?.name || channelId}`,
        });
      }
    } catch (e) {
      toast({ title: "Failed to generate AI nudge", variant: "destructive" });
    }
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Mobile-first responsive layout */}
      <div className="hidden md:block">
        <Sidebar
          channels={channels}
          selectedChannelId={selectedChannelId}
          onChannelSelect={handleChannelSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-16 glass-card border-b border-border/50 flex items-center px-4 rounded-none">
          <div className="flex items-center gap-3 w-full">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <h1 className="font-semibold">
              {selectedChannel?.name || "general"}
            </h1>
            <div className="hidden sm:flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>42 members</span>
              </div>
              <button
                onClick={handleAINudge}
                className="px-3 py-1 rounded text-xs font-medium bg-secondary hover:bg-secondary/80 flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" /> AI Nudge
              </button>
            </div>
          </div>
        </div>

        {/* Channel Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Show pinned card only in general channel */}
          {selectedChannelId === "general" && (
            <PinnedCard onStarterKitClick={handleStarterKitClick} />
          )}

          {/* Messages */}
          <MessageList messages={channelMessages} />

          {/* Message Composer (Disabled) */}
          <div className="p-4 border-t border-border/50">
            <div className="glass-card p-3 opacity-50 cursor-not-allowed">
              <p className="text-sm text-muted-foreground">
                Message composer is read-only in this demo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Channel Selector */}
      <div className="md:hidden fixed bottom-4 left-4 right-4">
        <div className="glass-card p-3 flex gap-2 overflow-x-auto">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelSelect(channel.id)}
              className={`flex-shrink-0 px-3 py-1 rounded text-sm font-medium transition-colors ${
                channel.id === selectedChannelId
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              #{channel.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
