import { Facebook, Instagram, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getContactLinks, storeInfo } from "@/lib/store-info";

const links = getContactLinks(storeInfo);

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="size-4 shrink-0"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.2-4.6a8.5 8.5 0 1 1 16.3-3.9Z" /><path d="M8.2 7.5c.5-.3 1.3 1.7 1.3 2s-.7.8-.7 1.1c.5 1.2 1.5 2.3 2.8 2.8.3 0 .8-.8 1.1-.8s2.4.9 2.1 1.5c-.5 1.2-1.2 1.5-2.4 1.1-2.8-.9-5.2-3.4-5.6-5.4-.2-1 .4-2 1.4-2.3Z" /></svg>;
}

function ContactLink({ href, label, icon, missing, iconOnly = false }: { href: string | undefined; label: string; icon: ReactNode; missing: string; iconOnly?: boolean }) {
  const className = iconOnly ? "rounded-full border border-border" : "h-auto min-h-9 justify-start whitespace-normal px-0 text-left hover:bg-transparent hover:text-accent";
  if (!href) return <Button disabled variant="ghost" size={iconOnly ? "icon" : "sm"} className={className} aria-label={`${label}: não informado`} title={`${label}: não informado`}>{icon}{!iconOnly && <span>{missing}</span>}</Button>;
  const external = href.startsWith("https:");
  return <Button asChild variant="ghost" size={iconOnly ? "icon" : "sm"} className={className}><a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={label} title={label}>{icon}{!iconOnly && <span>{label}</span>}</a></Button>;
}

export function ContactDetails() {
  return <div className="flex flex-col items-start gap-1">
    <ContactLink href={links.whatsapp} label={storeInfo.whatsapp ? `WhatsApp · ${storeInfo.whatsapp}` : "WhatsApp"} icon={<WhatsAppIcon />} missing="WhatsApp não informado" />
    <ContactLink href={links.phone} label={storeInfo.phone || "Telefone"} icon={<Phone />} missing="Telefone não informado" />
    <ContactLink href={links.email} label={storeInfo.email || "E-mail"} icon={<Mail />} missing="E-mail não informado" />
  </div>;
}

export function StoreLocation() {
  return <div className="space-y-3 text-sm">
    <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" /><address className="break-words not-italic leading-relaxed">{links.address || "Endereço não informado"}</address></div>
    <ContactLink href={links.maps} label="Abrir no Google Maps" icon={<ExternalLink />} missing="Localização não informada" />
  </div>;
}

export function SocialLinks() {
  return <div><div className="flex gap-3">
    <ContactLink href={links.instagram} label="Instagram" icon={<Instagram />} missing="" iconOnly />
    <ContactLink href={links.facebook} label="Facebook" icon={<Facebook />} missing="" iconOnly />
  </div>{!links.instagram && !links.facebook && <p className="mt-3 text-sm text-muted-foreground">Perfis não informados</p>}</div>;
}