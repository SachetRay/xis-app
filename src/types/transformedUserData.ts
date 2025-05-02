// Types for transformed user data structure

export interface Identity {
  firstName: string;
  lastName: string;
  countryCode: string;
  userAccountCreationDate: string;
  isAdobeEmployee: boolean;
}

export interface Email {
  address: string;
  emailDomain: string;
  hashedEmail: string;
  emailValidFlag: boolean;
}

export interface Authentication {
  authenticationSource: string;
  authenticationSourceType: string;
  signupSourceName: string;
  signupSocialAccount: string;
  signupCategory: string;
}

export interface AccountSystemInfo {
  type2eLinkedStatus: string;
  linkToType2e: boolean;
  type2eParentType: string;
}

export interface LanguagePreferences {
  firstPref: string;
  secondPref: string;
  thirdPref: string;
}

export interface ApplicationDetails {
  customerState: string;
}

export interface Status {
  ccFunnelState: string;
  dcFunnelState: string;
  applicationDetails: ApplicationDetails;
}

export interface UserDetails {
  identity: Identity;
  email: Email;
  authentication: Authentication;
  accountSystemInfo: AccountSystemInfo;
  languagePreferences: LanguagePreferences;
  status: Status;
}

export interface EmailMarketingPermission {
  time: string;
  source: string;
  value: boolean;
}

export interface ProductInfo {
  productCode: string;
  productName: string;
  productID: string;
  family: string;
}

export interface OfferInfo {
  offerType: string;
  offerStatus: string;
  offerStartDate: string;
  offerEndDate: string;
}

export interface IndividualEntitlements {
  numberOfEntitledProducts: number;
  productInfo: ProductInfo;
  offerInfo: OfferInfo;
}

export interface ContractInfo {
  buyingProgram: string;
  contractStartDTS: string;
  contractEndDTS: string;
  contractStatus: string;
  contractType: string;
}

export interface TeamEntitlements {
  contractInfo: ContractInfo;
  adminRoles: string[];
}

export interface ModelScore {
  modelName: string;
  modelPercentileScore: number;
  modelRawScore: number;
  modelVersion: string;
  modelLastUpdated: string;
}

export interface Action {
  actionName: string;
  actionType: string;
  actionStatus: string;
  actionDate: string;
  actionResult: string;
}

export interface ModelsAndScores {
  overallScore: ModelScore;
  actions: Action[];
}

export interface AppInstallInfo {
  firstActivityDate: string;
  recentActivityDate: string;
  mostRecentAppVersion: string;
  mostRecentOSVersion: string;
}

export interface DesktopInstalls {
  mac: AppInstallInfo;
  windows?: AppInstallInfo;
}

export interface WebInstalls {
  chrome?: AppInstallInfo;
  firefox?: AppInstallInfo;
  safari?: AppInstallInfo;
}

export interface DesktopLaunches {
  mac: AppInstallInfo;
  windows: AppInstallInfo;
}

export interface MobileLaunches {
  iOS: AppInstallInfo;
  android: AppInstallInfo;
}

export interface Launches {
  desktop: DesktopLaunches;
  mobile: MobileLaunches;
}

export interface ProductActivity {
  installs: {
    desktop: DesktopInstalls;
    web: WebInstalls;
  };
  launches: Launches;
}

export interface TransformedUserData {
  userDetails: UserDetails;
  emailMarketingPermission: EmailMarketingPermission;
  individualEntitlements: IndividualEntitlements;
  teamEntitlements: TeamEntitlements;
  modelsAndScores: ModelsAndScores;
  productActivity: ProductActivity;
}