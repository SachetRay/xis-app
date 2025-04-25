// Types for transformed user data structure

export interface Identity {
  firstName: string;
  lastName: string;
  countryCode: string;
  userAccountCreationDate: string;
  isAdobeEmployee: string;
}

export interface Email {
  address: string;
  emailDomain: string;
  hashedEmail: string;
  emailValidFlag: string;
}

export interface Authentication {
  authenticationSource: string;
  authenticationSourceType: string;
  signupSourceName: string;
  signupSocialAccount: string | null;
  signupCategory: string;
}

export interface AccountSystemInfo {
  type2eLinkedStatus: string;
  linkToType2e: string;
  type2eParentType: string | null;
}

export interface LanguagePreferences {
  firstPref: string;
  secondPref: string | null;
  thirdPref: string | null;
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
  val: boolean;
  time: string;
}

export interface ProductInfo {
  productCode: string;
  productName: string;
  productID: string;
  family: string;
  bundleID: string | null;
}

export interface OfferInfo {
  offerID: string;
  offerType: string;
  offerTermValue: number;
  offerTermUnit: string;
  promotionType: string | null;
  cloud: string;
  commitmentType: string;
}

export interface AcquisitionInfo {
  routeToMarket: string;
  marketSegment: string;
  appStore: string | null;
}

export interface TrialInfo {
  trialStartDTS: string;
  trialEndDTS: string;
}

export interface StatusInfo {
  paymentStatus: string;
  hardCancelDTS: string | null;
  softCancelDTS: string | null;
  tenure: string;
  purchaseDTS: string | null;
  lastPaymentConfirmationType: string | null;
}

export interface IndividualEntitlements {
  numberOfEntitledProducts: number;
  productInfo: ProductInfo;
  offerInfo: OfferInfo;
  acquisitionInfo: AcquisitionInfo;
  trialInfo: TrialInfo;
  statusInfo: StatusInfo;
}

export interface ContractInfo {
  buyingProgram: string;
  contractStartDTS: string;
  contractEndDTS: string;
  contractStatus: string;
  contractType: string;
  marketSegment: string;
}

export interface DelegationInfo {
  delegationStartDTS: string | null;
  delegationEndDTS: string | null;
  delegationStatus: string | null;
}

export interface B2BProductInfo {
  productArrangementCode: string;
  productCode: string;
  productName: string;
}

export interface B2BOfferInfo {
  offerID: string;
  offerType: string;
  offerTermValue: number;
  offerTermUnit: string;
}

export interface B2BStatusInfo {
  purchaseDTS: string;
  hardCancelDTS: string;
}

export interface TrialDetails {
  trialStartDTS: string;
  trialEndDTS: string;
  trialToPaidConversion: string;
  trialToPaidConversionDTS: string | null;
}

export interface B2BEntitlements {
  delegationInfo: DelegationInfo;
  productInfo: B2BProductInfo;
  offerInfo: B2BOfferInfo;
  statusInfo: B2BStatusInfo;
  trialDetails: TrialDetails;
}

export interface TeamEntitlements {
  contractInfo: ContractInfo;
  adminRoles: string[];
  b2bEntitlements: B2BEntitlements;
}

export interface OverallScore {
  modelScore: number;
  modelPercentileScore: string;
  modelScoreDate: string;
  modelUserSegment: string;
}

export interface Action {
  action: string;
  offerTerm: string;
  percentileScore: number;
  productPrice: number;
  rank: number;
  score: number;
  scoreDate: string;
  testID: string;
}

export interface Content {
  surface: string;
  URL: string;
  rank: number;
}

export interface ModelsAndScores {
  overallScore: OverallScore;
  actions: Action[];
  contents: Content[];
}

export interface PlatformActivity {
  firstActivityDate: string;
  recentActivityDate: string;
  mostRecentAppVersion: string;
  mostRecentOSVersion: string;
}

export interface DesktopPlatforms {
  mac: PlatformActivity;
  windows: PlatformActivity;
}

export interface ProductActivity {
  installs: {
    desktop: DesktopPlatforms;
    web: PlatformActivity;
  };
}

export interface TransformedUserData {
  userDetails: UserDetails;
  emailMarketingPermission: EmailMarketingPermission;
  individualEntitlements: IndividualEntitlements;
  teamEntitlements: TeamEntitlements;
  modelsAndScores: ModelsAndScores;
  productActivity: ProductActivity;
}