// The published @types/qrcode-generator only declares the create*Tag string
// helpers, not the matrix API (getModuleCount / isDark) we use to draw our own
// SVG modules in References.svelte. So we declare exactly what we use here.
declare module 'qrcode-generator' {
  interface QRCode {
    addData(data: string): void
    make(): void
    getModuleCount(): number
    isDark(row: number, col: number): boolean
  }
  function qrcode(
    typeNumber: number,
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
  ): QRCode
  export = qrcode
}
