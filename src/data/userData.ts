export interface UserData {
  person: {
    name: {
      firstname: string;
      lastname: string;
    };
  };
  homeAddress: {
    countryCode: string;
  };
  personalEmail: {
    address: string;
  };
  adobeCorpnew: {
    isAdobeEmployee: string;
    emailDomain: string;
    emailValidFlag: string;
    hashedEmail: string;
    memberAccountGUID: {
      modelsAndScores: {
        SKU_RANK: {
          modelScore: number;
          modelPercentileScore: string;
          modelScoreDate: string;
          modelUserSegment: string;
          actions: Array<{
            action: string;
            offerTerm: string;
            percentileScore: number;
            productPrice: number;
            rank: number;
            score: number;
            scoreDate: string;
            testID: string;
          }>;
          contents: Array<{
            surface: string;
            URL: string;
            rank: number;
          }>;
        };
      };
      entitlements: {
        numberOfEntitledProducts: number;
        [key: string]: any;
      };
      contract: {
        adminRoles: string[];
        buyingProgram: string;
        contractEndDTS: string;
        contractStartDTS: string;
        contractStatus: string;
        contractType: string;
        b2bEntitlements: {
          [key: string]: {
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
          };
        };
      };
      userDetails: {
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
        applicationDetails: {
          [key: string]: {
            customerState: string;
          };
        };
      };
      appUsage: {
        [key: string]: {
          appInstalls: {
            desktop: {
              mac: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
              windows: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
            };
            web: {
              firstActivityDate: string;
              recentActivityDate: string;
              mostRecentAppVersion: string;
              mostRecentOSVersion: string;
            };
            mobile: {
              iOS: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
              android: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
            };
          };
          appLaunches: {
            desktop: {
              mac: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
              windows: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
            };
            mobile: {
              iOS: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
              android: {
                firstActivityDate: string;
                recentActivityDate: string;
                mostRecentAppVersion: string;
                mostRecentOSVersion: string;
              };
            };
          };
        };
      };
    };
  };
}

export const userData: UserData = {
  "person": {
    "name": {
      "firstname": "John",
      "lastname": "Doe"
    }
  },
  "homeAddress": {
    "countryCode": "US"
  },
  "personalEmail": {
    "address": "john.doe@gmail.com"
  },
  "adobeCorpnew": {
    "isAdobeEmployee": "YES",
    "emailDomain": "adobe.com",
    "emailValidFlag": "YES",
    "hashedEmail": "YES",
    "memberAccountGUID": {
      "modelsAndScores": {
        "SKU_RANK": {
          "modelScore": 80,
          "modelPercentileScore": "95%",
          "modelScoreDate": "2023-01-01",
          "modelUserSegment": "Value Customer",
          "actions": [
            {
              "action": "View",
              "offerTerm": "Monthly",
              "percentileScore": 90,
              "productPrice": 29.99,
              "rank": 1,
              "score": 100,
              "scoreDate": "2023-01-15",
              "testID": "AB123"
            },
            {
              "action": "Purchase",
              "offerTerm": "Annually",
              "percentileScore": 80,
              "productPrice": 239.99,
              "rank": 2,
              "score": 85,
              "scoreDate": "2023-02-01",
              "testID": "AB123"
            }
          ],
          "contents": [
            {
              "surface": "Homepage",
              "URL": "/product/photoshop",
              "rank": 1
            },
            {
              "surface": "Homepage",
              "URL": "/product/illustrator",
              "rank": 2
            }
          ]
        }
      },
      "entitlements": {
        "numberOfEntitledProducts": 1,
        "phsp_direct_individual": {
          "offerID": "00D28C8779EE5ECF018E550694863180",
          "productCode": "PHSP",
          "productName": "ADOBE PHOTOSHOP",
          "routeToMarket": "ADOBE.COM/CC.COM",
          "appStore": "appStoreValue",
          "marketSegment": "COMMERCIAL",
          "offerType": "TRIALM",
          "offerTermUnit": "DAY",
          "offerTermValue": 7,
          "cloud": "CREATIVE",
          "commitmentType": "ABM",
          "purchaseDTS": "2020-05-01T21:28:38Z",
          "trialStartDTS": "2020-05-01T21:28:38Z",
          "trialEndDTS": "2020-05-07T21:28:38Z",
          "cancelDTS": "2020-06-01T21:28:38Z",
          "hardCancelDTS": "9999-12-31 23:59:59",
          "softCancelDTS": "9999-12-31 23:59:59",
          "lastPayment": null,
          "keyConfirmationType": "INVOICE",
          "family": "PHOTOSHOP_LIGHTROOM_FRESCO",
          "promotionType": null,
          "productID": "androidapp.lrmobile.puf.regular.test",
          "bundleID": "com.posa.android.sampleapp4",
          "paymentStatus": "CANCELLING",
          "tenure": "0-30"
        }
      },
      "contract": {
        "adminRoles": [
          "ORG_ADMIN"
        ],
        "buyingProgram": "VIP",
        "contractEndDTS": "2029-05-08 02:31:03",
        "contractStartDTS": "2024-05-08 02:31:03",
        "contractStatus": "ACTIVE",
        "contractType": "TEAM_DIRECT",
        "b2bEntitlements": {
          "phsp_direct_team": {
            "marketSegment": "COMMERCIAL",
            "delegationEndDTS": "2029-05-08 02:31:03",
            "delegationStartDTS": "2024-05-08 02:31:03",
            "delegationStatus": "ASSIGNED",
            "offerTermUnit": "DAY",
            "offerTermValue": 7,
            "offerType": "TRIAL",
            "offerID": "00D28C8779EE5ECF018E550694863180",
            "productArrangementCode": "phsp_direct_individual",
            "productCode": "PHSP",
            "productName": "ADOBE PHOTOSHOP",
            "purchaseDTS": "2020-05-01T21:28:38Z",
            "hardCancelDTS": "9999-12-31 23:59:59",
            "trialStartDTS": "2020-05-01T21:28:38Z",
            "trialEndDTS": "2020-05-07T21:28:38Z",
            "trialToPaidConversion": "TRUE",
            "trialToPaidConversionDTS": "2024-05-07T21:28:38Z"
          }
        }
      },
      "userDetails": {
        "authenticationSource": "WCD",
        "authenticationSourceType": "IND",
        "signupSourceName": "Adobe.com",
        "signupSocialAccount": "Apple",
        "signupCategory": "Creative",
        "userAccountCreationDate": "2020-06-01T21:28:38Z",
        "type2eLinkedStatus": "ACTIVE",
        "linkToType2e": "Yes",
        "type2eParentType": "Type 1",
        "firstPref": "en-us",
        "secondPref": "en-gb",
        "thirdPref": "de-de",
        "ccFunnelState": "LAPSED",
        "dcFunnelState": "LAPSED",
        "applicationDetails": {
          "PHOTOSHOP": {
            "customerState": "ENGAGED"
          }
        }
      },
      "appUsage": {
        "PHOTOSHOP": {
          "appInstalls": {
            "desktop": {
              "mac": {
                "firstActivityDate": "2022-01-15T10:00:00Z",
                "recentActivityDate": "2024-07-28T14:30:00Z",
                "mostRecentAppVersion": "24.2.1",
                "mostRecentOSVersion": "12.6.3"
              },
              "windows": {
                "firstActivityDate": "2022-03-20T09:00:00Z",
                "recentActivityDate": "2024-08-01T11:00:00Z",
                "mostRecentAppVersion": "23.5.0",
                "mostRecentOSVersion": "10.0.22621.1"
              }
            },
            "web": {
              "firstActivityDate": "2022-01-15T10:00:00Z",
              "recentActivityDate": "2024-07-28T14:30:00Z",
              "mostRecentAppVersion": "24.2.1",
              "mostRecentOSVersion": "12.6.3"
            },
            "mobile": {
              "iOS": {
                "firstActivityDate": "2023-05-10T16:00:00Z",
                "recentActivityDate": "2024-08-05T18:00:00Z",
                "mostRecentAppVersion": "15.4.0",
                "mostRecentOSVersion": "16.5.1"
              },
              "android": {
                "firstActivityDate": "2023-06-12T12:00:00Z",
                "recentActivityDate": "2024-08-10T15:00:00Z",
                "mostRecentAppVersion": "14.3.2",
                "mostRecentOSVersion": "11.0.22000.1"
              }
            }
          },
          "appLaunches": {
            "desktop": {
              "mac": {
                "firstActivityDate": "2024-01-20T08:00:00Z",
                "recentActivityDate": "2024-08-12T20:00:00Z",
                "mostRecentAppVersion": "2024.1.0",
                "mostRecentOSVersion": "14.0"
              },
              "windows": {
                "firstActivityDate": "2024-02-18T14:00:00Z",
                "recentActivityDate": "2024-08-15T09:00:00Z",
                "mostRecentAppVersion": "2024.2.0",
                "mostRecentOSVersion": "11.0.22621.1"
              }
            },
            "mobile": {
              "iOS": {
                "firstActivityDate": "2024-01-20T08:00:00Z",
                "recentActivityDate": "2024-08-12T20:00:00Z",
                "mostRecentAppVersion": "2024.1.0",
                "mostRecentOSVersion": "14.0"
              },
              "android": {
                "firstActivityDate": "2024-02-18T14:00:00Z",
                "recentActivityDate": "2024-08-15T09:00:00Z",
                "mostRecentAppVersion": "2024.2.0",
                "mostRecentOSVersion": "11.0.22000.1"
              }
            }
          }
        }
      }
    }
  }
}; 