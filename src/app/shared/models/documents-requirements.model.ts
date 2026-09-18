/**
 * Shared model for a single requirement table row / card.
 * Used by RequirementsTable and RequirementCard components.
 */

export interface RequirementDataResponse {
  active: boolean;
  allowedFormats: string[];
  descriptionAr: string;
  displayOrder: number;
  id: number;
  labelAr: string;
  labelEn: string;
  maxSizeMb: number;
  required: boolean;
  target: string;
  selected?: boolean;
}
export interface RequirementDataCreate {
  allowedFormats: string;
  descriptionAr: string;
  displayOrder: number;
  labelAr: string;
  labelEn: string;
  maxSizeMb: number;
  required: boolean;
  target: string;
}

export interface ReorderRequiermentData {
  id: number;
  displayOrder: number
}

