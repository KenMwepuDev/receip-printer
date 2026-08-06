import { useCallback, useState } from 'react'

const STORAGE_KEY = 'receipt-printer.session'
export const DEFAULT_PRINTER_LABEL = 'Imprimante thermique 58mm'

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.printerName) return null
    return {
      printerName: String(parsed.printerName),
      configuredAt: parsed.configuredAt ?? null,
    }
  } catch {
    return null
  }
}

export function usePrinterSession() {
  const [printer, setPrinterState] = useState(() => readSession())

  const setPrinter = useCallback((printerName) => {
    const next = {
      printerName: String(printerName).trim() || DEFAULT_PRINTER_LABEL,
      configuredAt: new Date().toISOString(),
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setPrinterState(next)
  }, [])

  const clearPrinter = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setPrinterState(null)
  }, [])

  return { printer, setPrinter, clearPrinter }
}
