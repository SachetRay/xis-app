import { TransformedUserData } from '../types/transformedUserData';

// Initial transformed structure that matches the hierarchical view in Data Wizard
export const transformedUserData: TransformedUserData = {
  userDetails: {
    identity: {
      firstName: "John",
      lastName: "Doe",
      countryCode: "US",
      userAccountCreationDate: "2024-01-01T00:00:00Z",
      isAdobeEmployee: false
    },
    email: {
      address: "john.doe@example.com",
      emailDomain: "example.com",
      hashedEmail: "5f4dcc3b5aa765d61d8327deb882cf99",
      emailValidFlag: true
    },
    authentication: {
      authenticationSource: "Adobe ID",
      authenticationSourceType: "Standard",
      signupSourceName: "Web",
      signupSocialAccount: "",
      signupCategory: "Individual"
    },
    accountSystemInfo: {
      type2eLinkedStatus: "Not Linked",
      linkToType2e: false,
      type2eParentType: ""
    },
    languagePreferences: {
      firstPref: "en-US",
      secondPref: "",
      thirdPref: ""
    },
    status: {
      ccFunnelState: "Trial",
      dcFunnelState: "Not Started",
      applicationDetails: {
        customerState: "Trial"
      }
    }
  },
  
  emailMarketingPermission: {
    value: true,
    source: "web",
    time: "2024-03-15T10:30:00Z"
  },
  
  individualEntitlements: {
    numberOfEntitledProducts: 1,
    productInfo: {
      productCode: "PHOTOSHOP_CC_INDV",
      productName: "Adobe Photoshop CC - Individual",
      productID: "PROD-PS-CC-I",
      family: "Creative Cloud"
    },
    offerInfo: {
      offerType: "Trial",
      offerStatus: "Active",
      offerStartDate: "2024-03-01T00:00:00Z",
      offerEndDate: "2024-03-31T00:00:00Z"
    }
  },
  
  teamEntitlements: {
    contractInfo: {
      buyingProgram: "VIP",
      contractStartDTS: "2024-02-01T00:00:00Z",
      contractEndDTS: "2025-02-01T00:00:00Z",
      contractStatus: "Active",
      contractType: "Team"
    },
    adminRoles: ["User"]
  },
  
  modelsAndScores: {
    overallScore: {
      modelName: "Customer Value",
      modelPercentileScore: 75.5,
      modelRawScore: 85,
      modelVersion: "1.0",
      modelLastUpdated: "2024-03-10T00:00:00Z"
    },
    actions: [
      {
        actionName: "View Product",
        actionType: "Engagement",
        actionStatus: "Completed",
        actionDate: "2023-01-15",
        actionResult: "Success"
      }
    ]
  },
  
  productActivity: {
    installs: {
      desktop: {
        mac: {
          firstActivityDate: "2024-03-01T15:30:00Z",
          recentActivityDate: "2024-03-15T09:45:00Z",
          mostRecentAppVersion: "25.5.0",
          mostRecentOSVersion: "14.3.1"
        },
        windows: {
          firstActivityDate: "",
          recentActivityDate: "",
          mostRecentAppVersion: "",
          mostRecentOSVersion: ""
        }
      },
      web: {},
    },
    launches: {
      desktop: {
        mac: {
          firstActivityDate: "2024-01-20T08:00:00Z",
          recentActivityDate: "2024-08-12T20:00:00Z",
          mostRecentAppVersion: "2024.1.0",
          mostRecentOSVersion: "14.0"
        },
        windows: {
          firstActivityDate: "2024-02-18T14:00:00Z",
          recentActivityDate: "2024-08-15T09:00:00Z",
          mostRecentAppVersion: "2024.2.0",
          mostRecentOSVersion: "11.0.22621.1"
        }
      },
      mobile: {
        iOS: {
          firstActivityDate: "2024-01-20T08:00:00Z",
          recentActivityDate: "2024-08-12T20:00:00Z",
          mostRecentAppVersion: "2024.1.0",
          mostRecentOSVersion: "14.0"
        },
        android: {
          firstActivityDate: "2024-02-18T14:00:00Z",
          recentActivityDate: "2024-08-15T09:00:00Z",
          mostRecentAppVersion: "2024.2.0",
          mostRecentOSVersion: "11.0.22621.1"
        }
      }
    }
  }
}; 