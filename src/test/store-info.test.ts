import { describe, expect, it } from "vitest";
import { getContactLinks, storeInfo } from "@/lib/store-info";

describe("Store contact configuration", () => {
  it("does not invent contact destinations when details are missing", () => {
    const links = getContactLinks(storeInfo);
    for (const key of ["phone", "whatsapp", "email", "maps", "instagram", "facebook"] as const) {
      expect(links[key]).toBeUndefined();
    }
  });
  it("opens a direct WhatsApp conversation with the configured number", () => {
    expect(getContactLinks({ ...storeInfo, whatsapp: "+55 (11) 99999-1234" }).whatsapp).toBe("https://wa.me/5511999991234");
  });
  it("uses the configured full address for Google Maps", () => {
    const links = getContactLinks({ ...storeInfo, address: "Rua de Teste, 123", city: "São Paulo", state: "SP", postalCode: "01000-000" });
    expect(new URL(links.maps ?? "").searchParams.get("query")).toBe("Rua de Teste, 123, São Paulo - SP, 01000-000");
  });
  it("only enables valid configured social destinations", () => {
    expect(getContactLinks({ ...storeInfo, instagram: "https://www.instagram.com/teste/", facebook: "https://www.facebook.com/teste/" })).toMatchObject({
      instagram: "https://www.instagram.com/teste/", facebook: "https://www.facebook.com/teste/",
    });
    expect(getContactLinks({ ...storeInfo, instagram: "javascript:alert(1)", facebook: "https://facebook.com.example.org" })).toMatchObject({ instagram: undefined, facebook: undefined });
  });
});