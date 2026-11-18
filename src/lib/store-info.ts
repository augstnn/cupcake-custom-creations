// Public store details only. Leave unknown values empty; never use example contacts.
// WhatsApp must include country and area codes (digits only).
export interface StoreContact {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  instagram: string;
  facebook: string;
}

export const storeInfo: StoreContact & { institutionalName: string } = {
  institutionalName: "Cupcake Custom Creations",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  instagram: "",
  facebook: "",
};

function safeSocialUrl(value: string, domain: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === domain || url.hostname.endsWith(`.${domain}`))
      ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function getContactLinks(info: StoreContact) {
  const whatsapp = info.whatsapp.replace(/\D/g, "");
  const phone = info.phone.replace(/[^\d+]/g, "");
  const address = [info.address, [info.city, info.state].filter(Boolean).join(" - "), info.postalCode].filter(Boolean).join(", ");
  return {
    whatsapp: /^\d{10,15}$/.test(whatsapp) ? `https://wa.me/${whatsapp}` : undefined,
    phone: /\d{8,15}/.test(phone) ? `tel:${phone}` : undefined,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email) ? `mailto:${info.email}` : undefined,
    maps: info.address.trim() && info.city.trim() && info.state.trim()
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : undefined,
    address,
    instagram: safeSocialUrl(info.instagram, "instagram.com"),
    facebook: safeSocialUrl(info.facebook, "facebook.com"),
  };
}