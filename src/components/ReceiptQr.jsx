import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function ReceiptQr({ value, className = 'receipt__qr' }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let cancelled = false

    QRCode.toDataURL(value, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 140,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) setSrc(url)
      })
      .catch(() => {
        if (!cancelled) setSrc('')
      })

    return () => {
      cancelled = true
    }
  }, [value])

  if (!src) {
    return <div className={`${className} ${className}--placeholder`} aria-hidden="true" />
  }

  return (
    <img
      className={className}
      src={src}
      width={140}
      height={140}
      alt={`QR code : ${value}`}
    />
  )
}
