/// <reference types="node" />

interface PDFData {
  numpages: number
  numrender: number
  info: any
  metadata: any
  text: string
  version: string
}

interface PDFOptions {
  debug?: boolean
  max?: number
  renderPage?: ((pageData: any) => any) | null
}

declare module 'pdf-parse/lib/pdf-parse.js' {
  function pdfParse(dataBuffer: Buffer | ArrayBuffer, options?: PDFOptions): Promise<PDFData>
  export default pdfParse
} 