// Transformed data schema definition
// This file contains only the structure/schema without actual values

// Identity information
export interface Identity {
  firstName: string;
  lastName: string;
  countryCode: string;
  userAccountCreationDate: string;
  isAdobeEmployee: boolean;
}

// Email information
export interface Email {
  address: string;
  emailDomain: string;
  hashedEmail: string;
  emailValidFlag: boolean;
}

// Authentication information
export interface Authentication {
  authenticationSource: string;
  authenticationSourceType: string;
  signupSourceName: string;
  signupSocialAccount: string | null;
  signupCategory: string;
}

// Account system information
export interface AccountSystemInfo {
  type2eLinkedStatus: string;
  linkToType2e: boolean;
  type2eParentType: string | null;
}

// Language preferences
export interface LanguagePreferences {
  firstPref: string;
  secondPref: string | null;
  thirdPref: string | null;
}

// Customer status information
export interface ApplicationDetails {
  customerState: string;
}

export interface Status {
  ccFunnelState: string;
  dcFunnelState: string;
  applicationDetails: ApplicationDetails;
}

// User details combining all above
export interface UserDetails {
  identity: Identity;
  email: Email;
  authentication: Authentication;
  accountSystemInfo: AccountSystemInfo;
  languagePreferences: LanguagePreferences;
  status: Status;
}

// Email marketing permission
export interface EmailMarketingPermission {
  value: boolean;
  source: string;
  time: string;
}

// Product information for entitlements
export interface ProductInfo {
  productCode: string;
  productName: string;
  productID: string;
  family: string;
  bundleID: string | null;
}

// Offer information for entitlements
export interface OfferInfo {
  offerType: string;
  offerStatus: string;
  offerStartDate: string;
  offerEndDate: string;
}

// Individual entitlements
export interface IndividualEntitlements {
  numberOfEntitledProducts: number;
  productInfo: ProductInfo;
  offerInfo: OfferInfo;
}

// Contract information
export interface ContractInfo {
  buyingProgram: string;
  contractStartDTS: string;
  contractEndDTS: string;
  contractStatus: string;
  contractType: string;
}

// Team entitlements
export interface TeamEntitlements {
  contractInfo: ContractInfo;
  adminRoles: string[];
}

// Models and scores
export interface OverallScore {
  modelName: string;
  modelPercentileScore: number;
  modelRawScore: number;
  modelVersion: string;
  modelLastUpdated: string;
}

export interface ActionInfo {
  actionName: string;
  actionType: string;
  actionStatus: string;
  actionDate: string;
  actionResult: string;
}

export interface ModelsAndScores {
  overallScore: OverallScore;
  actions: ActionInfo[];
}

// Product activity
export interface PlatformActivity {
  firstActivityDate: string;
  recentActivityDate: string;
  mostRecentAppVersion: string;
  mostRecentOSVersion: string;
}

export interface MacWindowsPlatforms {
  mac: PlatformActivity;
  windows: PlatformActivity;
}

export interface MobilePlatforms {
  iOS: PlatformActivity;
  android: PlatformActivity;
}

export interface Installs {
  desktop: MacWindowsPlatforms;
  web: Record<string, any>;
}

export interface Launches {
  desktop: MacWindowsPlatforms;
  mobile: MobilePlatforms;
}

export interface ProductActivity {
  installs: Installs;
  launches: Launches;
}

// The complete transformed data structure
export interface TransformedUserData {
  userDetails: UserDetails;
  emailMarketingPermission: EmailMarketingPermission;
  individualEntitlements: IndividualEntitlements;
  teamEntitlements: TeamEntitlements;
  modelsAndScores: ModelsAndScores;
  productActivity: ProductActivity;
}

// Empty schema structure (without values)
export const transformedSchema: TransformedUserData = {
  userDetails: {
    identity: {
      firstName: "",
      lastName: "",
      countryCode: "",
      userAccountCreationDate: "",
      isAdobeEmployee: false
    },
    email: {
      address: "",
      emailDomain: "",
      hashedEmail: "",
      emailValidFlag: false
    },
    authentication: {
      authenticationSource: "",
      authenticationSourceType: "",
      signupSourceName: "",
      signupSocialAccount: null,
      signupCategory: ""
    },
    accountSystemInfo: {
      type2eLinkedStatus: "",
      linkToType2e: false,
      type2eParentType: null
    },
    languagePreferences: {
      firstPref: "",
      secondPref: null,
      thirdPref: null
    },
    status: {
      ccFunnelState: "",
      dcFunnelState: "",
      applicationDetails: {
        customerState: ""
      }
    }
  },
  
  emailMarketingPermission: {
    value: false,
    source: "",
    time: ""
  },
  
  individualEntitlements: {
    numberOfEntitledProducts: 0,
    productInfo: {
      productCode: "",
      productName: "",
      productID: "",
      family: "",
      bundleID: null
    },
    offerInfo: {
      offerType: "",
      offerStatus: "",
      offerStartDate: "",
      offerEndDate: ""
    }
  },
  
  teamEntitlements: {
    contractInfo: {
      buyingProgram: "",
      contractStartDTS: "",
      contractEndDTS: "",
      contractStatus: "",
      contractType: ""
    },
    adminRoles: []
  },
  
  modelsAndScores: {
    overallScore: {
      modelName: "",
      modelPercentileScore: 0,
      modelRawScore: 0,
      modelVersion: "",
      modelLastUpdated: ""
    },
    actions: []
  },
  
  productActivity: {
    installs: {
      desktop: {
        mac: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        },
        windows: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        }
      },
      web: {}
    },
    launches: {
      desktop: {
        mac: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        },
        windows: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        }
      },
      mobile: {
        iOS: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        },
        android: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        }
      }
    }
  }
}; 