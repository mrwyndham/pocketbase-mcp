declare module 'pocketbase' {
  export interface CollectionModel {
    id: string;
    name: string;
    schema: SchemaField[];
    indexes?: CollectionIndex[];
    [key: string]: any;
  }

  export interface SchemaField {
    name: string;
    type: string;
    required: boolean;
    options?: Record<string, any>;
  }

  export interface CollectionIndex {
    name: string;
    fields: string[];
    unique?: boolean;
  }

  export interface CollectionResponse<T = Record<string, any>> {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: T[];
    [Symbol.iterator](): Iterator<T>;
  }

  export default class PocketBase {
    constructor(url: string);
    
    collections: {
      create(data: { name: string; schema: SchemaField[] }): Promise<CollectionModel>;
      getOne(idOrName: string): Promise<CollectionModel>;
      getList(page?: number, perPage?: number, options?: any): Promise<CollectionResponse>;
      update(id: string, data: Partial<CollectionModel>): Promise<CollectionModel>;
      delete(id: string): Promise<boolean>;
    };

    collection(name: string): {
      create(data: Record<string, any>): Promise<Record<string, any>>;
      getList(page?: number, perPage?: number, options?: any): Promise<CollectionResponse>;
      getFullList(batch?: number, options?: any): Promise<Record<string, any>[]>;
      update(id: string, data: Record<string, any>): Promise<Record<string, any>>;
      delete(id: string): Promise<boolean>;
      authWithPassword(email: string, password: string): Promise<{
        token: string;
        user: Record<string, any>;
      }>;
    };
  }
}
