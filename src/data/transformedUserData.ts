import { TransformedUserData } from '../types/transformedUserData';

// Initial transformed structure that matches the hierarchical view in Data Wizard
export const transformedUserData: TransformedUserData = {
  userDetails: {
    identity: {
      firstName: '',
      lastName: '',
      countryCode: '',
      userAccountCreationDate: '',
      isAdobeEmployee: 'false'
    },
    email: {
      address: '',
      emailDomain: '',
      hashedEmail: '',
      emailValidFlag: 'false'
    },
    authentication: {
      authenticationSource: '',
      authenticationSourceType: '',
      signupSourceName: '',
      signupSocialAccount: null,
      signupCategory: ''
    },
    accountSystemInfo: {
      type2eLinkedStatus: '',
      linkToType2e: '',
      type2eParentType: null
    },
    languagePreferences: {
      firstPref: '',
      secondPref: null,
      thirdPref: null
    },
    status: {
      ccFunnelState: '',
      dcFunnelState: '',
      applicationDetails: {
        customerState: ''
      }
    }
  },
  
  emailMarketingPermission: {
    val: false,
    time: ''
  },
  
  individualEntitlements: {
    numberOfEntitledProducts: 0,
    productInfo: {
      productCode: '',
      productName: '',
      productID: '',
      family: '',
      bundleID: null
    },
    offerInfo: {
      offerID: '',
      offerType: '',
      offerTermValue: 0,
      offerTermUnit: '',
      promotionType: null,
      cloud: '',
      commitmentType: ''
    },
    acquisitionInfo: {
      routeToMarket: '',
      marketSegment: '',
      appStore: null
    },
    trialInfo: {
      trialStartDTS: '',
      trialEndDTS: ''
    },
    statusInfo: {
      paymentStatus: '',
      hardCancelDTS: null,
      softCancelDTS: null,
      tenure: '',
      purchaseDTS: null,
      lastPaymentConfirmationType: null
    }
  },
  
  teamEntitlements: {
    contractInfo: {
      buyingProgram: '',
      contractStartDTS: '',
      contractEndDTS: '',
      contractStatus: '',
      contractType: '',
      marketSegment: ''
    },
    adminRoles: [],
    b2bEntitlements: {
      delegationInfo: {
        delegationStartDTS: null,
        delegationEndDTS: null,
        delegationStatus: null
      },
      productInfo: {
        productArrangementCode: '',
        productCode: '',
        productName: ''
      },
      offerInfo: {
        offerID: '',
        offerType: '',
        offerTermValue: 0,
        offerTermUnit: ''
      },
      statusInfo: {
        purchaseDTS: '',
        hardCancelDTS: ''
      },
      trialDetails: {
        trialStartDTS: '',
        trialEndDTS: '',
        trialToPaidConversion: '',
        trialToPaidConversionDTS: null
      }
    }
  },
  
  modelsAndScores: {
    overallScore: {
      modelScore: 0,
      modelPercentileScore: '',
      modelScoreDate: '',
      modelUserSegment: ''
    },
    actions: [],
    contents: []
  },
  
  productActivity: {
    installs: {
      desktop: {
        mac: {
          firstActivityDate: '',
          recentActivityDate: '',
          mostRecentAppVersion: '',
          mostRecentOSVersion: ''
        },
        windows: {
          firstActivityDate: '',
          recentActivityDate: '',
          mostRecentAppVersion: '',
          mostRecentOSVersion: ''
        }
      },
      web: {
        firstActivityDate: '',
        recentActivityDate: '',
        mostRecentAppVersion: '',
        mostRecentOSVersion: ''
      }
    }
  }
}; 