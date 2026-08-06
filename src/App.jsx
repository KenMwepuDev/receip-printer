import { useEffect, useRef, useState } from 'react'
import Receipt from './components/Receipt'
import {
  DEFAULT_PRINTER_LABEL,
  usePrinterSession,
} from './hooks/usePrinterSession'
import { printReceiptElement } from './print/printReceipt'
import './App.css'

export default function App() {
  const { printer, setPrinter, clearPrinter } = usePrinterSession()
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameDraft, setNameDraft] = useState(DEFAULT_PRINTER_LABEL)
  const awaitingNameRef = useRef(false)
  const receiptRef = useRef(null)

  useEffect(() => {
    function handleAfterPrint() {
      if (!awaitingNameRef.current) return
      awaitingNameRef.current = false
      setNameDraft(printer?.printerName || DEFAULT_PRINTER_LABEL)
      setShowNameModal(true)
    }

    // Keep for Ctrl+P on the main page; button print uses iframe callback
    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [printer])

  function onIframeAfterPrint() {
    if (!awaitingNameRef.current) return
    awaitingNameRef.current = false
    setNameDraft(printer?.printerName || DEFAULT_PRINTER_LABEL)
    setShowNameModal(true)
  }

  function runPrint() {
    printReceiptElement(receiptRef.current, { onAfterPrint: onIframeAfterPrint })
  }

  function handlePrint() {
    if (!printer) awaitingNameRef.current = true
    runPrint()
  }

  function handleChangePrinter() {
    clearPrinter()
    awaitingNameRef.current = true
    runPrint()
  }

  function handleConfirmName(event) {
    event.preventDefault()
    setPrinter(nameDraft)
    setShowNameModal(false)
  }

  function handleSkipName() {
    setPrinter(DEFAULT_PRINTER_LABEL)
    setShowNameModal(false)
  }

  return (
    <div className="app">
      <aside className="panel no-print">
        <header className="panel__header">
          <h1>Receipt Printer</h1>
          <p>Reçu d’exemple 58&nbsp;mm via le dialogue d’impression du navigateur.</p>
        </header>

        <section className="panel__printer" aria-live="polite">
          <h2>Imprimante</h2>
          {printer ? (
            <p className="panel__status panel__status--ok">
              <span className="panel__label">Session</span>
              {printer.printerName}
            </p>
          ) : (
            <p className="panel__status">
              Aucune imprimante mémorisée. Choisissez-en une dans le dialogue
              d’impression.
            </p>
          )}
        </section>

        <div className="panel__actions">
          <button type="button" className="btn btn--primary" onClick={handlePrint}>
            Imprimer
          </button>
          {printer ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleChangePrinter}
            >
              Changer d’imprimante
            </button>
          ) : null}
        </div>

        <p className="panel__hint">
          Format forcé : <strong>58 × 297&nbsp;mm</strong> (Roll Paper). La
          1ʳᵉ fois, sélectionne « Roll Paper 58 x 297 mm » dans le dialogue —
          Chrome le réutilisera ensuite.
        </p>
      </aside>

      <main className="preview">
        <p className="preview__caption no-print">Aperçu 58 mm · 150%</p>
        <div ref={receiptRef}>
          <Receipt />
        </div>
      </main>

      {showNameModal ? (
        <div
          className="modal no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="printer-name-title"
        >
          <form className="modal__card" onSubmit={handleConfirmName}>
            <h2 id="printer-name-title">Nom de l’imprimante</h2>
            <p>
              Indiquez le nom vu dans le dialogue pour le mémoriser pendant
              cette session.
            </p>
            <label className="modal__field">
              <span>Nom</span>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
                placeholder={DEFAULT_PRINTER_LABEL}
              />
            </label>
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={handleSkipName}>
                Utiliser le défaut
              </button>
              <button type="submit" className="btn btn--primary">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
