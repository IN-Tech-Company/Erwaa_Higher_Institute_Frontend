

export interface SellerData {
  active: boolean;
  confirmed: boolean;
  firstName: string;
  id: number;
  lastName: string;
  phone: string;
  profileImageUrl: string | null;
  storeImageUrl: string | null;
  storeName: string | null;
  createdAt?: string;
  commercialRegistrationNumber?: string;
}

export interface AllSellersResponse {
    content: SellerData[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        unpaged: boolean;
    };
    size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number; 
}