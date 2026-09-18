export interface CompanyDocumentDto {
  documentId: number | null;
  requirementId: number;
  requirementLabelAr: string;
  requirementLabelEn: string;
  required: boolean;
  allowedFormats: string[];
  maxSizeMb: number;
  uploaded: boolean;
  fileUrl: string | null;
  originalFileName: string | null;
  fileSizeBytes: number;
  uploadedAt: string | null;
}
