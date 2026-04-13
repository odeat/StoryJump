import React from 'react';

interface InfoOverlayProps {
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ onClose }) => {
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
        <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, letterSpacing: 2, color: '#39ff14' }}>
          📁 HET_DINER.EXE — INFO TERMINAL
        </span>
        <button onClick={onClose} style={{
          background: '#7b1515', border: 'none', color: '#fff', width: 22, height: 22,
          borderRadius: 3, cursor: 'pointer', fontSize: 14, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>
      <div style={{
        padding: '16px 18px', overflowY: 'auto', flex: 1,
        fontFamily: "'Share Tech Mono', monospace", fontSize: '12.5px', color: '#bbb', lineHeight: 1.75,
      }}>
        <Section title="BOEKGEGEVENS">
          <InfoLine label="Titel" value="Het Diner" />
          <InfoLine label="Auteur" value="Herman Koch" />
          <InfoLine label="Jaar" value="2009 — Uitgeverij Anthos, Amsterdam" />
          <InfoLine label="Niveau" value="15–18 jaar | Niveau 3 | Bovenbouw Havo/VWO" />
          <InfoLine label="Trefwoorden" value="Geweld, Ouder-kindrelatie" />
        </Section>
        <Section title="OVER DE AUTEUR">
          <p>Herman Koch (Arnhem, 1953) groeide op in Amsterdam. Op school stond hij bekend als een verbaal vaardige pester — een eigenschap die hij bewust koestert als drijfveer voor zijn schrijverschap. Hij debuteerde in 1985 en brak pas echt door met <em>Het Diner</em>. Kenmerkend: nauwkeurige formuleringen, zwarte humor, scherpe satire en treffende typeringen.</p>
        </Section>
        <Section title="THEMA'S">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {['Moreel dilemma', 'Ouder-kindrelatie', 'Erfelijkheid', 'Familiegeheimen', 'Liegen & bedriegen', 'Schijnheiligheid'].map(t => (
              <span key={t} style={{
                display: 'inline-block', background: '#111', border: '1px solid #2a2a2a',
                color: '#ffb000', fontFamily: "'VT323', monospace", fontSize: 13,
                padding: '1px 8px', borderRadius: 3,
              }}>{t}</span>
            ))}
          </div>
          <p>Hoe ver ga je als ouder om je kind te beschermen? Michel en Rick hebben een dakloze vrouw verbrand bij een pinautomaat. De vier ouders reageren allemaal anders: van totale doofpotmentaliteit tot bereidheid alles openbaar te maken.</p>
        </Section>
        <Section title="OPBOUW & STRUCTUUR">
          <p>Klassieke tragedie in <strong>vijf bedrijven</strong> (gangen: Aperitief → Digestief) + epiloog (Fooi). Eenheid van <em>tijd</em> (~24 uur), <em>plaats</em> (chic restaurant Amsterdam) en <em>handeling</em>. Sleutelhoofdstuk: <strong>hst. 21</strong> — "Dit is er gebeurd. Dit zijn de feiten."</p>
        </Section>
        <Section title="PERSPECTIEF & STIJL">
          <p>Paul is een <strong>onbetrouwbare ik-verteller</strong>: psychiatrisch verleden, erfelijke agressie, slikt zijn medicijnen niet. Koch schrijft met aforistische oneliners, droogkomische bespiegelingen en subtiele running gags.</p>
        </Section>
        <Section title="MOTIEVEN PERSONAGES">
          <InfoLine label="Paul & Claire" value="Zwijgen om Michel te beschermen. Claire moedigde Michel zelfs aan Beau 'uit de weg te ruimen'." />
          <InfoLine label="Serge" value="Wil open kaart spelen — wordt door de anderen actief tegengewerkt." />
          <InfoLine label="Babette" value="Wil ten koste van alles first lady worden." />
        </Section>
        <Section title="SUCCES & PRIJZEN">
          <p>🏆 NS Publieksprijs 2009 · Top 10 Europa 2009 · 100.000 exemplaren in 3 maanden · Verfilmd 2013 door Menno Meyjes</p>
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{
      fontFamily: "'VT323', monospace", fontSize: 20, color: '#39ff14',
      margin: '0 0 6px', borderBottom: '1px solid #1e1e1e', paddingBottom: 3, letterSpacing: 2,
    }}>▌ {title}</h2>
    {children}
  </div>
);

const InfoLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <p><span style={{ color: '#ffb000' }}>{label}: </span>{value}</p>
);

export default InfoOverlay;
