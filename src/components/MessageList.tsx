import { Message } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="message-slide-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{message.avatar || '👤'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-sm">{message.author}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground break-words">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}