export default function WhatsAppFloat({ siteContent }) {
  return (
    <a
      href={siteContent.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-[52px] items-center rounded-full bg-[#1fa855] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(31,168,85,0.25)] transition hover:-translate-y-0.5 hover:bg-[#1c9d50]"
    >
      WhatsApp
    </a>
  );
}
