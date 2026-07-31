import { useState, useRef, useEffect } from 'react';
import { Header } from '@api-banking/design.navigation.header';
import styles from './App.module.scss';

type Role = 'user' | 'assistant';

interface Message {
  id: number;
  role: Role;
  text: string;
}

const SUGGESTIONS = [
  'Build an Open FD journey for an existing customer',
  'Generate a Stitch form payload to open a fixed deposit',
  'What instruction types are available in Stitch?',
];

function formatText(text: string): string {
  let s = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  s = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_: string, __: string, code: string) =>
    `<pre><code>${code.trimEnd()}</code></pre>`
  );
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\n/g, '<br>');
  return s;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  let nextId = useRef(0);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setInputValue('');

    const userMsg: Message = { id: nextId.current++, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: nextId.current++,
        role: 'assistant',
        text: data.error ? `Error: ${data.error}` : data.text,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: nextId.current++,
        role: 'assistant',
        text: 'Something went wrong. Please try again.',
      }]);
    }

    setBusy(false);
    textareaRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(inputValue);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  }

  const showWelcome = messages.length === 0 && !busy;

  return (
    <div className={styles.app}>
      <Header
        logoProps={{ name: 'API Banking', slogan: 'Banking Journey Builder' }}
      />

      <div className={styles.chatArea} ref={chatRef}>
        {showWelcome && (
          <div className={styles.welcome}>
            <p className={styles.welcomeTitle}>Banking Journey Builder</p>
            <p className={styles.welcomeSubtitle}>
              I can build complete banking onboarding journeys and generate correct Stitch API payloads.
              Try one of these to get started:
            </p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <button key={s} className={styles.suggestion} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : ''}`}
          >
            <div className={`${styles.avatar} ${msg.role === 'user' ? styles.avatarUser : styles.avatarAssistant}`}>
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div
              className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}`}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
          </div>
        ))}

        {busy && (
          <div className={styles.message}>
            <div className={`${styles.avatar} ${styles.avatarAssistant}`}>AI</div>
            <div className={`${styles.bubble} ${styles.bubbleAssistant} ${styles.typingBubble}`}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            rows={1}
            value={inputValue}
            placeholder="Ask me to build a banking journey…"
            onChange={handleInput}
            onKeyDown={handleKey}
            disabled={busy}
          />
          <button
            className={styles.sendButton}
            onClick={() => send(inputValue)}
            disabled={busy || !inputValue.trim()}
            title="Send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className={styles.hint}>Press Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  );
}
