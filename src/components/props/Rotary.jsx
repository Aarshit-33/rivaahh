import { RotaryPhone } from '@/hero/DeskRight'

// The home hero's rotary telephone, usable anywhere. The hero positions it on
// its desk; here it sits in normal flow and fills its container's width.
// `note` shows the handwritten sticky note beside it.
export default function Rotary({ className = '', note = false }) {
  return (
    <div className={`pp-rotary ${note ? 'pp-rotary--note' : ''} ${className}`}>
      <RotaryPhone />
    </div>
  )
}
