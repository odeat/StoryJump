import React, { useState, useMemo } from 'react';
import { ALL_QUESTIONS } from '../gameData';
import { QuizQuestion } from '../types';

interface QuizOverlayProps {
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const QuizOverlay: React.FC<QuizOverlayProps> = ({ onClose }) => {
  const questions = useMemo(() => shuffle(ALL_QUESTIONS).slice(0, 10), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  const answer = (i: number) => {
    if (answered) return;
    setAnswered(true);
    setChosen(i);
    if (i === q.ans) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1);
      setAnswered(false);
      setChosen(null);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setChosen(null);
    setFinished(false);
  };

  const pct = Math.round(score / questions.length * 100);
  const msgs = ['💡 Bestudeer de Info Terminal!', '📖 Redelijk — lees de samenvatting.', '👍 Goed gedaan!', '🌟 Uitstekend!', '🏆 Perfect! Jij kent Het Diner als geen ander!'];

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
        <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, letterSpacing: 2, color: '#00cfff' }}>
          🧠 QUIZ_DINER.EXE — TEST JE KENNIS
        </span>
        <button onClick={onClose} style={{
          background: '#7b1515', border: 'none', color: '#fff', width: 22, height: 22,
          borderRadius: 3, cursor: 'pointer', fontSize: 14, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>
      <div style={{
        padding: '16px 18px', overflowY: 'auto', flex: 1,
        fontFamily: "'Share Tech Mono', monospace", color: '#bbb', fontSize: '12.5px',
      }}>
        {!finished ? (
          <>
            <div style={{
              fontFamily: "'VT323', monospace", fontSize: 15, color: '#444',
              marginBottom: 10, display: 'flex', justifyContent: 'space-between',
            }}>
              <span>VRAAG {idx + 1} / {questions.length}</span>
              <span style={{ color: '#ffb000' }}>Score: {score}</span>
            </div>
            <div style={{
              fontFamily: "'VT323', monospace", fontSize: 20, color: '#eee',
              lineHeight: 1.45, marginBottom: 14, minHeight: 52,
            }}>
              {q.q}
            </div>
            {q.opts.map((opt, i) => {
              let bg = '#0d0d0d', border = '#222', color = '#aaa';
              if (answered) {
                if (i === q.ans) { bg = '#071a07'; border = '#27ae60'; color = '#58d68d'; }
                else if (i === chosen) { bg = '#1a0707'; border = '#922b21'; color = '#e74c3c'; }
              }
              return (
                <button key={i} onClick={() => answer(i)} disabled={answered} style={{
                  display: 'block', width: '100%', background: bg,
                  border: `1px solid ${border}`, color,
                  fontFamily: "'Share Tech Mono', monospace", fontSize: 12,
                  padding: '9px 14px', marginBottom: 7, borderRadius: 4,
                  cursor: answered ? 'default' : 'pointer', textAlign: 'left',
                  transition: 'all .15s',
                }}>
                  {opt}
                </button>
              );
            })}
            {answered && (
              <>
                <div style={{
                  fontFamily: "'VT323', monospace", fontSize: 18, minHeight: 24, margin: '8px 0 12px',
                  color: chosen === q.ans ? '#58d68d' : '#e74c3c',
                }}>
                  {chosen === q.ans ? '✓ CORRECT!' : `✗ FOUT — goed: "${q.opts[q.ans]}"`}
                </div>
                <button onClick={next} style={{
                  background: '#061306', border: '1px solid #27ae60', color: '#39ff14',
                  fontFamily: "'VT323', monospace", fontSize: 18, padding: '8px 22px',
                  borderRadius: 4, cursor: 'pointer', letterSpacing: 1,
                }}>
                  {idx + 1 < questions.length ? 'VOLGENDE ▶' : 'RESULTATEN ▶'}
                </button>
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <h2 style={{ fontFamily: "'VT323', monospace", fontSize: 32, color: '#39ff14', margin: '0 0 8px' }}>
              ▌ QUIZ VOLTOOID
            </h2>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#888' }}>Jouw eindstand:</p>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: 68, color: '#ffb000', lineHeight: 1, margin: '10px 0' }}>
              {score} / {questions.length}
            </div>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#888' }}>
              {msgs[Math.min(4, Math.floor(pct / 20))]}
            </p>
            <button onClick={restart} style={{
              background: '#0d0d0d', border: '1px solid #ffb000', color: '#ffb000',
              fontFamily: "'VT323', monospace", fontSize: 19, padding: '8px 24px',
              borderRadius: 4, cursor: 'pointer', marginTop: 14,
            }}>↩ OPNIEUW</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOverlay;
