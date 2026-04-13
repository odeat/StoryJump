import React, { useState, useRef, useEffect } from 'react';

interface ChatOverlayProps {
  onClose: () => void;
}

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hallo! Ik ben de Diner-bot 🤖 Stel me gerust vragen over Het Diner van Herman Koch — personages, thema\'s, opbouw, stijl, alles!' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChat = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setSending(true);

    // Simple local response based on keywords (no API needed)
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = 'Interessante vraag! Helaas kan ik daar op dit moment geen uitgebreid antwoord op geven. Probeer te vragen over personages, thema\'s of de opbouw van het boek.';

      if (lower.includes('paul')) {
        reply = 'Paul Lohman is de ik-verteller van het boek. Hij is onbetrouwbaar: hij heeft een psychiatrisch verleden en een erfelijke aandoening die leidt tot gewelddadige woedeaanvallen. Hij slikt zijn medicijnen niet meer. Ondanks alles houdt hij van zijn vrouw Claire en zoon Michel.';
      } else if (lower.includes('claire')) {
        reply = 'Claire is de vrouw van Paul. Ze lijkt rustig en beheerst, maar blijkt een sleutelrol te spelen: ze heeft Michel aangemoedigd om Beau "uit de weg te ruimen" en heeft stiekem een vruchtwateronderzoek laten doen.';
      } else if (lower.includes('serge')) {
        reply = 'Serge Lohman is Pauls broer en gedoodverfde minister-president. Hij is de enige die open kaart wil spelen over wat de jongens hebben gedaan. De andere drie ouders proberen hem tegen te houden.';
      } else if (lower.includes('michel') || lower.includes('rick')) {
        reply = 'Michel (zoon van Paul) en Rick (zoon van Serge) hebben samen een dakloze vrouw verbrand bij een pinautomaat. Ze filmden het en de video verscheen als "Men in Black III" op YouTube.';
      } else if (lower.includes('thema')) {
        reply = 'De belangrijkste thema\'s zijn: het moreel dilemma (hoe ver ga je om je kind te beschermen?), ouder-kindrelatie, erfelijkheid van geweld, familiegeheimen, liegen & bedriegen, en schijnheiligheid.';
      } else if (lower.includes('opbouw') || lower.includes('structuur')) {
        reply = 'Het boek volgt de structuur van een klassieke tragedie in vijf bedrijven, vernoemd naar de gangen van het diner: Aperitief, Voorgerecht, Hoofdgerecht, Dessert en Digestief. Er is ook een epiloog genaamd "Fooi".';
      } else if (lower.includes('fooi') || lower.includes('450')) {
        reply = 'Paul geeft de gérant 450 euro fooi om hem om te kopen. De gérant moet beloven dat hij Paul en Michel nooit in de tuin heeft gezien — zo wordt een cruciale getuige het zwijgen opgelegd.';
      } else if (lower.includes('beau')) {
        reply = 'Beau is de geadopteerde zoon van Serge en Babette. Hij chanteert Michel en Rick voor 3000 euro met de video. Claire en Paul besluiten dat Beau "het probleem" is dat opgelost moet worden.';
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setSending(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      background: '#0a0a0a', border: '3px solid #333', borderRadius: 8,
      boxShadow: '0 0 0 5px #1a1a1a, 0 0 50px rgba(0,0,0,0.9)',
      zIndex: 200, width: 'min(680px, 96vw)', maxHeight: '88vh',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        background: '#0d0d0d', borderBottom: '1px solid #2a2a2a',
        padding: '8px 14px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, letterSpacing: 2, color: '#ffb000' }}>
          💬 DINER_BOT v1.0 — STEL VRAGEN OVER HET BOEK
        </span>
        <button onClick={onClose} style={{
          background: '#7b1515', border: 'none', color: '#fff', width: 22, height: 22,
          borderRadius: 3, cursor: 'pointer', fontSize: 14, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{
          flex: 1, minHeight: 260, maxHeight: 300, overflowY: 'auto',
          background: '#040404', border: '1px solid #1e1e1e', borderRadius: 4,
          padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              maxWidth: '88%', padding: '8px 12px', borderRadius: 5,
              fontFamily: "'Share Tech Mono', monospace", fontSize: 12, lineHeight: 1.55,
              ...(msg.role === 'bot'
                ? { background: '#061306', border: '1px solid #0e2e0e', color: '#39ff14', alignSelf: 'flex-start' }
                : { background: '#131000', border: '1px solid #2e2000', color: '#ffb000', alignSelf: 'flex-end' }),
            }}>
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 3 }}>
                {msg.role === 'bot' ? 'DINER_BOT' : 'JIJ'}
              </div>
              {msg.text}
            </div>
          ))}
          {sending && (
            <div style={{
              padding: '8px 12px', borderRadius: 5, background: '#061306',
              border: '1px solid #0e2e0e', color: '#39ff14', alignSelf: 'flex-start',
              fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
            }}>
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 3 }}>DINER_BOT</div>
              ● ● ●
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendChat()}
            placeholder="Stel een vraag over Het Diner..."
            style={{
              flex: 1, background: '#080808', border: '1px solid #2a2a2a',
              color: '#39ff14', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
              padding: '8px 10px', borderRadius: 4, outline: 'none',
            }}
          />
          <button onClick={sendChat} disabled={sending} style={{
            background: '#061306', border: '1px solid #1a3a1a', color: '#39ff14',
            fontFamily: "'VT323', monospace", fontSize: 17, padding: '0 16px',
            borderRadius: 4, cursor: sending ? 'default' : 'pointer',
            opacity: sending ? 0.35 : 1,
          }}>STUUR ▶</button>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
