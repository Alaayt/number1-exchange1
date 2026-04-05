import React from 'react'

function FlowDots() {
  return (
    <div style={flowWrap}>
      <style>{`
        @keyframes flowDot {
          0%, 100% { opacity: 0.15; transform: scale(0.75); }
          50%       { opacity: 1;    transform: scale(1);    }
        }
        .fd1 { animation: flowDot 1.5s ease-in-out infinite 0s;    }
        .fd2 { animation: flowDot 1.5s ease-in-out infinite 0.35s; }
        .fd3 { animation: flowDot 1.5s ease-in-out infinite 0.7s;  }
        .fd4 { animation: flowDot 1.5s ease-in-out infinite 1.05s; }
      `}</style>
      <span className="fd1" style={dot('#1D9E75')} />
      <span className="fd2" style={dot('#5DCAA5')} />
      <span className="fd3" style={dot('#9FE1CB')} />
      <span className="fd4" style={dot('#378ADD')} />
    </div>
  )
}

const flowWrap = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '0 10px',
  flexShrink: 0,
}

const dot = (color) => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: color,
  flexShrink: 0,
})

export default FlowDots
