import {
  sampleReceipt,
  lineTotal,
  receiptTotals,
  formatMoney,
} from '../data/sampleReceipt'
import StoreLogo from './StoreLogo'
import ReceiptQr from './ReceiptQr'
import './Receipt.css'

export default function Receipt({ data = sampleReceipt }) {
  const { subtotal, tax, total } = receiptTotals(data)
  const taxPercent = Math.round(data.taxRate * 100)

  return (
    <article className="receipt" aria-label="Aperçu du reçu">
      <header className="receipt__header">
        <StoreLogo />
        <p className="receipt__store">{data.store.name}</p>
        <p>{data.store.address}</p>
        <p>{data.store.city}</p>
        <p>{data.store.phone}</p>
      </header>

      <hr className="receipt__sep" />

      <section className="receipt__meta">
        <p>
          Ticket {data.ticketNumber}
          <br />
          {data.date} {data.time}
          <br />
          Caisse : {data.cashier}
        </p>
      </section>

      <hr className="receipt__sep" />

      <ul className="receipt__items">
        {data.items.map((item) => (
          <li key={item.name} className="receipt__item">
            <div className="receipt__item-name">{item.name}</div>
            <div className="receipt__row">
              <span>
                {item.qty} x {formatMoney(item.unitPrice)}
              </span>
              <span>{formatMoney(lineTotal(item))}</span>
            </div>
          </li>
        ))}
      </ul>

      <hr className="receipt__sep" />

      <section className="receipt__totals">
        <div className="receipt__row">
          <span>Sous-total</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="receipt__row">
          <span>TVA {taxPercent}%</span>
          <span>{formatMoney(tax)}</span>
        </div>
        <div className="receipt__row receipt__total">
          <span>TOTAL</span>
          <span>{formatMoney(total)}</span>
        </div>
      </section>

      <hr className="receipt__sep" />

      <footer className="receipt__footer">
        <p>{data.footer}</p>
        <div className="receipt__qr-wrap">
          <ReceiptQr value={data.qrPayload} />
          <p className="receipt__qr-caption">Scannez pour le détail</p>
        </div>
        <p className="receipt__format">58 mm · 150%</p>
      </footer>
    </article>
  )
}
