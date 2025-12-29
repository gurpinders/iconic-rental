'use client';

export default function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
    >
      🖨️ Print Invoice
    </button>
  );
}