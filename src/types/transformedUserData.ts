// Types for transformed user data structure

interface ActivityInfo {
  firstActivityDate: string | null;
  recentActivityDate: string | null;
  mostRecentAppVersion: string | null;
  mostRecentOSVersion: string | null;
}

interface Identity {
  firstName: string;
  lastName: string;
  countryCode: string;
  userAccountCreationDate: string;
  isAdobeEmployee: boolean;
}

interface Email {
  address: string;
  emailDomain: string;
  hashedEmail: string;
  emailValidFlag: boolean;
}

interface Authentication {
  authenticationSource: string;
  authenticationSourceType: string;
  signupSourceName: string;
  signupSocialAccount: string;
  signupCategory: string;
}

interface AccountSystemInfo {
  type2eLinkedStatus: string;
  linkToType2e: string | null;
  type2eParentType: string | null;
}

interface LanguagePreferences {
  firstPref: string;
  secondPref: string;
  thirdPref: string;
}

interface Status {
  ccFunnelState: string;
  dcFunnelState: string;
  applicationDetails: {
    customerState: string;
  };
}

interface UserDetails {
  identity: Identity;
  email: Email;
  authentication: Authentication;
  accountSystemInfo: AccountSystemInfo;
  languagePreferences: LanguagePreferences;
  status: Status;
}

interface EmailMarketingPermission {
  val: boolean;
  time: string;
}

interface ProductInfo {
  productCode: string;
  productName: string;
  productID: string;
  family: string;
  bundleID: string | null;
}

interface OfferInfo {
  offerID: string;
  offerType: string;
  offerTermValue: number;
  offerTermUnit: string;
  promotionType: string;
  cloud: string;
  commitmentType: string;
}

interface AcquisitionInfo {
  routeToMarket: string;
  marketSegment: string;
  appStore: string | null;
}

interface TrialInfo {
  trialStartDTS: string;
  trialEndDTS: string;
}

interface StatusInfo {
  paymentStatus: string;
  hardCancelDTS: string | null;
  softCancelDTS: string | null;
  tenure: number;
  purchaseDTS: string | null;
  lastPaymentConfirmationType: string | null;
}

interface IndividualEntitlements {
  numberOfEntitledProducts: number;
  productInfo: ProductInfo;
  offerInfo: OfferInfo;
  acquisitionInfo: AcquisitionInfo;
  trialInfo: TrialInfo;
  statusInfo: StatusInfo;
}

interface ContractInfo {
  buyingProgram: string;
  contractStartDTS: string;
  contractEndDTS: string;
  contractStatus: string;
  contractType: string;
  marketSegment: string;
}

interface DelegationInfo {
  delegationStartDTS: string | null;
  delegationEndDTS: string | null;
  delegationStatus: string | null;
}

interface B2bProductInfo {
  productArrangementCode: string;
  productCode: string;
  productName: string;
}

interface B2bOfferInfo {
  offerID: string;
  offerType: string;
  offerTermValue: number;
  offerTermUnit: string;
}

interface B2bStatusInfo {
  purchaseDTS: string;
  hardCancelDTS: string | null;
}

interface B2bTrialDetails {
  trialStartDTS: string | null;
  trialEndDTS: string | null;
  trialToPaidConversion: boolean;
  trialToPaidConversionDTS: string | null;
}

interface B2bEntitlements {
  delegationInfo: DelegationInfo;
  productInfo: B2bProductInfo;
  offerInfo: B2bOfferInfo;
  statusInfo: B2bStatusInfo;
  trialDetails: B2bTrialDetails;
}

interface TeamEntitlements {
  contractInfo: ContractInfo;
  adminRoles: string[];
  b2bEntitlements: B2bEntitlements;
}

interface OverallScore {
  modelScore: number;
  modelPercentileScore: number;
  modelScoreDate: string;
  modelUserSegment: string;
}

interface ModelsAndScores {
  overallScore: OverallScore;
  actions: string[];
  contents: string[];
}

interface PlatformActivity {
  firstActivityDate: string | null;
  recentActivityDate: string | null;
  mostRecentAppVersion: string | null;
  mostRecentOSVersion: string | null;
}

interface DesktopActivity {
  mac: PlatformActivity;
  windows: PlatformActivity;
}

interface MobileActivity {
  iOS: PlatformActivity;
  android: PlatformActivity;
}

interface WebActivity {
  firstActivityDate: string;
  recentActivityDate: string;
  mostRecentAppVersion: string;
  mostRecentOSVersion: string | null;
}

interface Installs {
  desktop: DesktopActivity;
  mobile: MobileActivity;
  web: WebActivity;
}

interface Launches {
  desktop: DesktopActivity;
  mobile: MobileActivity;
}

interface ProductActivity {
  installs: Installs;
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