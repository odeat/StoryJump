import React from 'react';

interface DialogueBoxProps {
  speaker: string;
  text: string;
  isComplete: boolean;
  onAdvance: () => void;
  emoji?: string | null;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, text, isComplete, onAdvance, emoji }) => {
  return (
    <div
      onClick={onAdvance}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(10,10,10,0.96)', borderTop: '3px solid #555',
        padding: '14px 20px 16px', zIndex: 50, maxHeight: '38%', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{
          float: 'left', marginRight: 14, width: 52, height: 52, borderRadius: 4,
          border: '2px solid #333', background: '#111', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
        }}>
          {emoji || '📦'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'VT323', monospace", fontSize: 19, color: '#ffb000',
            letterSpacing: 2, marginBottom: 5,
          }}>
            {speaker}
          </div>
          <div style={{
            fontFamily: "'VT323', monospace", fontSize: 17, color: '#e8e8e8',
            lineHeight: 1.55, minHeight: 48,
          }}>
            {text}
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', right: 20, bottom: 14,
        fontFamily: "'VT323', monospace", fontSize: 15, color: '#666',
        animation: 'blink 0.9s infinite',
        opacity: isComplete ? 1 : 0,
      }}>
        ▼ E / ENTER
      </div>
    </div>
  );
};

export default DialogueBox;
