import { siteContent } from "../data/siteContent";

export default function WhatsAppFloat() {
  return (
    <a
      href={siteContent.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden randevu al"
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-[#20ba59] focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-black sm:bottom-5 sm:right-5 md:bottom-6 md:right-6"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.53 0 .17 5.36.17 11.96c0 2.1.55 4.15 1.59 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.7 1.46h.01c6.59 0 11.95-5.36 11.95-11.96 0-3.19-1.24-6.2-3.41-8.38Zm-8.54 18.3h-.01a9.92 9.92 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.62-.24-.37a9.9 9.9 0 0 1-1.53-5.21c0-5.5 4.48-9.98 9.99-9.98 2.66 0 5.16 1.03 7.04 2.92a9.88 9.88 0 0 1 2.91 7.05c0 5.5-4.48 9.98-9.98 9.98Zm5.47-7.48c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.5-.89-.8-1.49-1.79-1.66-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.89 1.23 3.1c.15.2 2.13 3.25 5.16 4.56.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.08-.12-.27-.2-.57-.35Z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
      <span className="sm:hidden">Randevu</span>
    </a>
  );
}
