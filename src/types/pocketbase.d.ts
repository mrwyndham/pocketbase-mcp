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
      
      // Auth methods
      listAuthMethods(): Promise<{
        usernamePassword: boolean;
        emailPassword: boolean;
        authProviders: Array<{
          name: string;
          state: string;
          codeVerifier: string;
          codeChallenge: string;
          codeChallengeMethod: string;
          authUrl: string;
        }>;
      }>;
      
      authWithPassword(email: string, password: string): Promise<{
        token: string;
        user: Record<string, any>;
      }>;
      
      authWithOAuth2(
        provider: string,
        code: string,
        codeVerifier: string,
        redirectUrl: string
      ): Promise<{
        token: string;
        user: Record<string, any>;
        meta?: {
          [key: string]: any;
        };
      }>;
      
      authWithOAuth2Code(
        provider: string,
        code: string,
        codeVerifier: string,
        redirectUrl: string
      ): Promise<{
        token: string;
        user: Record<string, any>;
        meta?: {
          [key: string]: any;
        };
      }>;
      
      authWithOtp(email: string): Promise<boolean>;
      
      authRefresh(): Promise<{
        token: string;
        user: Record<string, any>;
      }>;
      
      requestVerification(email: string): Promise<boolean>;
      
      confirmVerification(token: string): Promise<boolean>;
      
      requestPasswordReset(email: string): Promise<boolean>;
      
      confirmPasswordReset(
        token: string,
        password: string,
        passwordConfirm: string
      ): Promise<boolean>;
      
      requestEmailChange(newEmail: string): Promise<boolean>;
      
      confirmEmailChange(
        token: string,
        password: string
      ): Promise<{
        token: string;
        user: Record<string, any>;
      }>;
      
      impersonate(userId: string): Promise<{
        token: string;
        user: Record<string, any>;
      }>;
    };
  }
}
