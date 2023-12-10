import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
};

export type Data = {
  __typename?: 'Data';
  data?: Maybe<Scalars['String']['output']>;
};

export type Doc = {
  __typename?: 'Doc';
  _id: Scalars['ObjectId']['output'];
  createdAt: Scalars['Date']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  docId: Scalars['String']['output'];
  email?: Maybe<Array<Scalars['String']['output']>>;
  isShared: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  thumbnail: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addDoc: Scalars['Boolean']['output'];
  changeDocName: Scalars['Boolean']['output'];
  changeText: Scalars['Boolean']['output'];
  createDoc: Scalars['Boolean']['output'];
  deleteEmail: Scalars['Boolean']['output'];
  login: UserOutput;
  saveDoc: Scalars['Boolean']['output'];
  saveThumbnail: Scalars['Boolean']['output'];
  signup: UserOutput;
};


export type MutationAddDocArgs = {
  data?: InputMaybe<DocInput>;
};


export type MutationChangeDocNameArgs = {
  docId: Scalars['String']['input'];
  newDocName: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};


export type MutationChangeTextArgs = {
  data: Scalars['JSON']['input'];
  docId: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};


export type MutationCreateDocArgs = {
  docId: Scalars['String']['input'];
  docName: Scalars['String']['input'];
  emailId: Scalars['String']['input'];
};


export type MutationDeleteEmailArgs = {
  deleteEmail: Scalars['String']['input'];
  docId: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: UserInput;
};


export type MutationSaveDocArgs = {
  data: Scalars['JSON']['input'];
  docId: Scalars['String']['input'];
};


export type MutationSaveThumbnailArgs = {
  docId: Scalars['String']['input'];
  thumbnail: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  data: UserInput;
};

export type Query = {
  __typename?: 'Query';
  findUser: Scalars['Boolean']['output'];
  getAllDocs?: Maybe<Array<Doc>>;
  getDocData?: Maybe<Doc>;
};


export type QueryFindUserArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllDocsArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDocDataArgs = {
  docId: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  reflectChanges: Scalars['JSON']['output'];
  subscribeToDoc: Doc;
};


export type SubscriptionReflectChangesArgs = {
  docId: Scalars['String']['input'];
  userEmail: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  email: Scalars['String']['output'];
  forgotPasswordToken: Scalars['String']['output'];
  forgotPasswordTokenExpiry: Scalars['Date']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  verifyToken: Scalars['String']['output'];
  verifyTokenExpiry: Scalars['Date']['output'];
};

export type DocInput = {
  docId: Scalars['String']['input'];
  emailId: Scalars['String']['input'];
};

export type UserInput = {
  emailId: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserOutput = {
  __typename?: 'userOutput';
  success: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Data: ResolverTypeWrapper<Data>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Doc: ResolverTypeWrapper<Doc>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  docInput: DocInput;
  userInput: UserInput;
  userOutput: ResolverTypeWrapper<UserOutput>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Data: Data;
  Date: Scalars['Date']['output'];
  Doc: Doc;
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  ObjectId: Scalars['ObjectId']['output'];
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  User: User;
  docInput: DocInput;
  userInput: UserInput;
  userOutput: UserOutput;
}>;

export type DataResolvers<ContextType = any, ParentType extends ResolversParentTypes['Data'] = ResolversParentTypes['Data']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DocResolvers<ContextType = any, ParentType extends ResolversParentTypes['Doc'] = ResolversParentTypes['Doc']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  docId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  isShared?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addDoc?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, Partial<MutationAddDocArgs>>;
  changeDocName?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeDocNameArgs, 'docId' | 'newDocName' | 'userEmail'>>;
  changeText?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeTextArgs, 'data' | 'docId' | 'userEmail'>>;
  createDoc?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCreateDocArgs, 'docId' | 'docName' | 'emailId'>>;
  deleteEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEmailArgs, 'deleteEmail' | 'docId' | 'userEmail'>>;
  login?: Resolver<ResolversTypes['userOutput'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  saveDoc?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveDocArgs, 'data' | 'docId'>>;
  saveThumbnail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSaveThumbnailArgs, 'docId' | 'thumbnail'>>;
  signup?: Resolver<ResolversTypes['userOutput'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'data'>>;
}>;

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  findUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, Partial<QueryFindUserArgs>>;
  getAllDocs?: Resolver<Maybe<Array<ResolversTypes['Doc']>>, ParentType, ContextType, Partial<QueryGetAllDocsArgs>>;
  getDocData?: Resolver<Maybe<ResolversTypes['Doc']>, ParentType, ContextType, RequireFields<QueryGetDocDataArgs, 'docId'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  reflectChanges?: SubscriptionResolver<ResolversTypes['JSON'], "reflectChanges", ParentType, ContextType, RequireFields<SubscriptionReflectChangesArgs, 'docId' | 'userEmail'>>;
  subscribeToDoc?: SubscriptionResolver<ResolversTypes['Doc'], "subscribeToDoc", ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ObjectId'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  forgotPasswordToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  forgotPasswordTokenExpiry?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verifyToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verifyTokenExpiry?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['userOutput'] = ResolversParentTypes['userOutput']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Data?: DataResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Doc?: DocResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  userOutput?: UserOutputResolvers<ContextType>;
}>;

