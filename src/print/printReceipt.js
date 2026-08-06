/** Matches Epson "Roll Paper 58 x 297 mm" */
const PAPER_WIDTH_MM = 58
const PAPER_HEIGHT_MM = 297

const RECEIPT_PRINT_CSS = `
  @page {
    size: ${PAPER_WIDTH_MM}mm ${PAPER_HEIGHT_MM}mm;
    margin: 0;
  }

  @media print {
    @page {
      size: ${PAPER_WIDTH_MM}mm ${PAPER_HEIGHT_MM}mm;
      margin: 0;
    }
  }

  * { box-sizing: border-box; }

  html, body {
    width: ${PAPER_WIDTH_MM}mm !important;
    max-width: ${PAPER_WIDTH_MM}mm !important;
    min-width: ${PAPER_WIDTH_MM}mm !important;
    height: ${PAPER_HEIGHT_MM}mm !important;
    max-height: ${PAPER_HEIGHT_MM}mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    overflow: hidden !important;
  }

  .receipt {
    width: ${PAPER_WIDTH_MM}mm !important;
    max-width: ${PAPER_WIDTH_MM}mm !important;
    min-width: ${PAPER_WIDTH_MM}mm !important;
    margin: 0 !important;
    padding: 2mm !important;
    background: #fff !important;
    color: #000 !important;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 1.3;
    text-align: left;
    zoom: 1 !important;
    box-shadow: none !important;
  }

  .receipt p { margin: 0; }
  .receipt__header { text-align: center; }
  .receipt__logo {
    display: block;
    width: 48px;
    height: 48px;
    margin: 0 auto 6px;
    color: #000;
  }
  .receipt__store {
    font-weight: 700;
    font-size: 1.25em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .receipt__sep {
    margin: 6px 0;
    border: 0;
    border-top: 1px dashed #000;
    height: 0;
    width: 100%;
  }
  .receipt__meta { font-size: 0.95em; }
  .receipt__items {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .receipt__item { margin-bottom: 6px; }
  .receipt__item-name { font-weight: 600; }
  .receipt__row {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    font-size: 0.95em;
  }
  .receipt__totals { margin-top: 2px; }
  .receipt__total {
    margin-top: 4px;
    font-weight: 700;
    font-size: 1.15em;
  }
  .receipt__footer {
    text-align: center;
    margin-top: 4px;
  }
  .receipt__qr-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
  }
  .receipt__qr {
    display: block;
    width: 28mm;
    height: 28mm;
    image-rendering: pixelated;
  }
  .receipt__qr-caption {
    font-size: 0.75em;
  }
  .receipt__format {
    margin-top: 6px;
    font-size: 0.8em;
    opacity: 0.7;
  }
`

/**
 * Prints the receipt on a 58×297 mm page (Epson "Roll Paper 58 x 297 mm").
 * Browsers cannot pick the named driver size; matching the exact size helps
 * Chrome/Edge select that format (or remember it after one manual choice).
 */
export function printReceiptElement(target, { onAfterPrint } = {}) {
  const receiptEl =
    target?.classList?.contains('receipt')
      ? target
      : target?.querySelector?.('.receipt')

  if (!receiptEl) {
    onAfterPrint?.()
    return
  }

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.cssText = [
    'position:fixed',
    'left:-10000px',
    'top:0',
    `width:${PAPER_WIDTH_MM}mm`,
    `height:${PAPER_HEIGHT_MM}mm`,
    'border:0',
    'opacity:0',
    'pointer-events:none',
  ].join(';')

  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  const win = iframe.contentWindow

  doc.open()
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8">` +
      `<title>Receipt 58x297</title>` +
      `<style>${RECEIPT_PRINT_CSS}</style></head>` +
      `<body>${receiptEl.outerHTML}</body></html>`,
  )
  doc.close()

  let settled = false
  const finish = () => {
    if (settled) return
    settled = true
    win.removeEventListener('afterprint', finish)
    iframe.remove()
    onAfterPrint?.()
  }

  const run = () => {
    win.addEventListener('afterprint', finish)
    win.focus()
    win.print()
  }

  const waitForImages = () => {
    const images = Array.from(doc.images || [])
    if (images.length === 0) {
      requestAnimationFrame(run)
      return
    }
    Promise.all(
      images.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.onload = resolve
                img.onerror = resolve
              }),
      ),
    ).then(() => requestAnimationFrame(run))
  }

  if (doc.fonts?.ready) {
    doc.fonts.ready.then(waitForImages).catch(waitForImages)
  } else {
    waitForImages()
  }
}
