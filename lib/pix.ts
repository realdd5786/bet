import { CREDIT_PACKAGES } from "./credits";

export function getPackageById(packageId: string) {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
}

export function generatePixPayload(amountBRL: number, purchaseId: string) {
  return `00020126580014BR.GOV.BCB.PIX0136futmax-${purchaseId}520400005303986540${amountBRL}5802BR5920FutMax Sandbox6009SAO PAULO62140510sandbox${purchaseId}6304ABCD`;
}

export function generateQrBase64(payload: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='white'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='black'>${payload.slice(0, 10)}...</text></svg>`;
  return Buffer.from(svg).toString("base64");
}
