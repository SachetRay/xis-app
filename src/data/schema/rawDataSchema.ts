// Raw data schema definition based on XDM structure
// This file contains only the structure/schema without actual values

export interface Name {
  firstname: string;
  lastname: string;
}

export interface Person {
  name: Name;
}

export interface HomeAddress {
  countryCode: string;
}

export interface PersonalEmail {
  address: string;
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
  modelScore: number;
  modelPercentileScore: string;
  modelScoreDate: string;
  modelUserSegment: string;
  actions: Action[];
  contents: Content[];
}

export interface Entitlement {
  offerID: string;
  productCode: string;
  productName: string;
  routeToMarket: string;
  appStore: string;
  marketSegment: string;
  offerType: string;
  offerTermUnit: string;
  offerTermValue: number;
  cloud: string;
  commitmentType: string;
  purchaseDTS: string;
  trialStartDTS: string;
  trialEndDTS: string;
  cancelDTS: string;
  hardCancelDTS: string;
  softCancelDTS: string;
  lastPayment: null | string;
  keyConfirmationType: string;
  family: string;
  promotionType: null | string;
  productID: string;
  bundleID: string;
  paymentStatus: string;
  tenure: string;
}

export interface Entitlements {
  numberOfEntitledProducts: number;
  phsp_direct_individual: Entitlement;
}

export interface B2bEntitlements {
  marketSegment: string;
  delegationEndDTS: string;
  delegationStartDTS: string;
  delegationStatus: string;
  offerTermUnit: string;
  offerTermValue: number;
  offerType: string;
  offerID: string;
  productArrangementCode: string;
  productCode: string;
  productName: string;
  purchaseDTS: string;
  hardCancelDTS: string;
  trialStartDTS: string;
  trialEndDTS: string;
  trialToPaidConversion: string;
  trialToPaidConversionDTS: string;
}

export interface Contract {
  adminRoles: string[];
  buyingProgram: string;
  contractEndDTS: string;
  contractStartDTS: string;
  contractStatus: string;
  contractType: string;
  b2bEntitlements: B2bEntitlements;
}

export interface ApplicationDetails {
  customerState: string;
}

export interface UserDetails {
  authenticationSource: string;
  authenticationSourceType: string;
  signupSourceName: string;
  signupSocialAccount: string;
  signupCategory: string;
  userAccountCreationDate: string;
  type2eLinkedStatus: string;
  linkToType2e: string;
  type2eParentType: string;
  firstPref: string;
  secondPref: string;
  thirdPref: string;
  ccFunnelState: string;
  dcFunnelState: string;
  applicationDetails: ApplicationDetails;
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

export interface MobilePlatforms {
  iOS: PlatformActivity;
  android: PlatformActivity;
}

export interface AppInstalls {
  desktop: DesktopPlatforms;
  web: PlatformActivity;
  mobile: MobilePlatforms;
}

export interface AppLaunches {
  desktop: DesktopPlatforms;
  mobile: MobilePlatforms;
}

export interface AppUsage {
  appInstalls: AppInstalls;
  appLaunches: AppLaunches;
}

export interface MemberAccountGUID {
  modelsAndScores: ModelsAndScores;
  entitlements: Entitlements;
  contract: Contract;
  userDetails: UserDetails;
  appUsage: AppUsage;
}

export interface AdobeCorpnew {
  isAdobeEmployee: string;
  emailDomain: string;
  emailValidFlag: string;
  hashedEmail: string;
  memberAccountGUID: MemberAccountGUID;
}

export interface RawUserData {
  person: Person;
  homeAddress: HomeAddress;
  personalEmail: PersonalEmail;
  adobeCorpnew: AdobeCorpnew;
}

// Empty schema structure (without values)
export const rawDataSchema: RawUserData = {
  person: {
    name: {
      firstname: "",
      lastname: ""
    }
  },
  homeAddress: {
    countryCode: ""
  },
  personalEmail: {
    address: ""
  },
  adobeCorpnew: {
    isAdobeEmployee: "",
    emailDomain: "",
    emailValidFlag: "",
    hashedEmail: "",
    memberAccountGUID: {
      modelsAndScores: {
        modelScore: 0,
        modelPercentileScore: "",
        modelScoreDate: "",
        modelUserSegment: "",
        actions: [],
        contents: []
      },
      entitlements: {
        numberOfEntitledProducts: 0,
        phsp_direct_individual: {
          offerID: "",
          productCode: "",
          productName: "",
          routeToMarket: "",
          appStore: "",
          marketSegment: "",
          offerType: "",
          offerTermUnit: "",
          offerTermValue: 0,
          cloud: "",
          commitmentType: "",
          purchaseDTS: "",
          trialStartDTS: "",
          trialEndDTS: "",
          cancelDTS: "",
          hardCancelDTS: "",
          softCancelDTS: "",
          lastPayment: null,
          keyConfirmationType: "",
          family: "",
          promotionType: null,
          productID: "",
          bundleID: "",
          paymentStatus: "",
          tenure: ""
        }
      },
      contract: {
        adminRoles: [],
        buyingProgram: "",
        contractEndDTS: "",
        contractStartDTS: "",
        contractStatus: "",
        contractType: "",
        b2bEntitlements: {
          marketSegment: "",
          delegationEndDTS: "",
          delegationStartDTS: "",
          delegationStatus: "",
          offerTermUnit: "",
          offerTermValue: 0,
          offerType: "",
          offerID: "",
          productArrangementCode: "",
          productCode: "",
          productName: "",
          purchaseDTS: "",
          hardCancelDTS: "",
          trialStartDTS: "",
          trialEndDTS: "",
          trialToPaidConversion: "",
          trialToPaidConversionDTS: ""
        }
      },
      userDetails: {
        authenticationSource: "",
        authenticationSourceType: "",
        signupSourceName: "",
        signupSocialAccount: "",
        signupCategory: "",
        userAccountCreationDate: "",
        type2eLinkedStatus: "",
        linkToType2e: "",
        type2eParentType: "",
        firstPref: "",
        secondPref: "",
        thirdPref: "",
        ccFunnelState: "",
        dcFunnelState: "",
        applicationDetails: {
          customerState: ""
        }
      },
      appUsage: {
        appInstalls: {
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
          web: {
            firstActivityDate: "",
            recentActivityDate: "",
            mostRecentAppVersion: "",
            mostRecentOSVersion: ""
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
        },
        appLaunches: {
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
    }
  }
}; 