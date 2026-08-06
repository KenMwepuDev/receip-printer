/** Sample 58mm thermal receipt (~32 chars at 100% scale). */

export const sampleReceipt = {
  store: {
    name: 'Café du Port',
    address: '12 Quai Saint-Pierre',
    city: '17000 La Rochelle',
    phone: '05 46 00 00 00',
  },
  ticketNumber: 'A-00482',
  date: '06/08/2026',
  time: '10:42',
  cashier: 'Marie',
  items: [
    { name: 'Espresso', qty: 2, unitPrice: 1.8 },
    { name: 'Croissant beurre', qty: 1, unitPrice: 1.5 },
    { name: 'Jus orange pressé', qty: 1, unitPrice: 3.5 },
    { name: 'Eau plate 50cl', qty: 1, unitPrice: 2.0 },
  ],
  taxRate: 0.1,
  footer: 'Merci de votre visite !',
  /** Encoded in the footer QR (ticket / avis). */
  qrPayload: 'https://cafeduport.example/ticket/A-00482',
}

export function lineTotal(item) {
  return item.qty * item.unitPrice
}

export function receiptTotals(receipt = sampleReceipt) {
  const subtotal = receipt.items.reduce((sum, item) => sum + lineTotal(item), 0)
  const tax = subtotal * receipt.taxRate
  return { subtotal, tax, total: subtotal + tax }
}

export function formatMoney(value) {
  return `${value.toFixed(2).replace('.', ',')} EUR`
}
