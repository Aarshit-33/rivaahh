import { ImageResponse } from 'next/og'

export const alt = 'Nimantran — digital invitations for Indian celebrations'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The share card: a cream page, a maroon invitation and the brand line.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 96px',
          background: '#f5ede0',
          color: '#2a1e1a',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: '#b08d57', textTransform: 'uppercase' }}>Nimantran</div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, lineHeight: 1.02, marginTop: 24 }}>
            <span>Invitations worth</span>
            <span style={{ color: '#6b1e2e', fontStyle: 'italic' }}>opening.</span>
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 28, color: '#5c4b42' }}>
            Weddings, birthdays, Griha Pravesh and every celebration — made for the phone, shared in one link.
          </div>
        </div>
        <div
          style={{
            width: 270,
            height: 480,
            display: 'flex',
            padding: 14,
            borderRadius: 40,
            background: '#1f1714',
            boxShadow: '0 40px 70px -30px rgba(60,25,15,0.55)',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 28,
              background: 'linear-gradient(170deg, #7a2436, #3f0e1a)',
              color: '#f3dcae',
              border: '2px solid #d6b274',
            }}
          >
            <div style={{ fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(243,220,174,0.8)' }}>
              You are invited
            </div>
            <div style={{ fontSize: 40, fontStyle: 'italic', marginTop: 16 }}>Ananya</div>
            <div style={{ fontSize: 28, fontStyle: 'italic' }}>&amp; Kabir</div>
            <div
              style={{
                marginTop: 28,
                width: 46,
                height: 46,
                borderRadius: 46,
                background: '#c9a86a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f1020',
                fontSize: 24,
                fontStyle: 'italic',
              }}
            >
              N
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
