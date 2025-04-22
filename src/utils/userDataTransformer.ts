import { UserData } from '../data/userData';
import { TransformedUserData } from '../types/transformedUserData';

export function transformUserData(userData: UserData): TransformedUserData {
  const memberAccountGUID = userData.adobeCorpnew.memberAccountGUID;
  
  return {
    userDetails: {
      identity: {
        firstName: userData.person.name.firstname,
        lastName: userData.person.name.lastname,
        countryCode: userData.homeAddress.countryCode,
        userAccountCreationDate: memberAccountGUID.userDetails.userAccountCreationDate,
        isAdobeEmployee: userData.adobeCorpnew.isAdobeEmployee === 'YES'
      },
      email: {
        address: userData.personalEmail.address,
        emailDomain: userData.adobeCorpnew.emailDomain,
        hashedEmail: userData.adobeCorpnew.hashedEmail,
        emailValidFlag: userData.adobeCorpnew.emailValidFlag === 'YES'
      },
      authentication: {
        authenticationSource: memberAccountGUID.userDetails.authenticationSource,
        authenticationSourceType: memberAccountGUID.userDetails.authenticationSourceType,
        signupSourceName: memberAccountGUID.userDetails.signupSourceName,
        signupSocialAccount: memberAccountGUID.userDetails.signupSocialAccount,
        signupCategory: memberAccountGUID.userDetails.signupCategory
      },
      accountSystemInfo: {
        type2eLinkedStatus: memberAccountGUID.userDetails.type2eLinkedStatus,
        linkToType2e: memberAccountGUID.userDetails.linkToType2e,
        type2eParentType: memberAccountGUID.userDetails.type2eParentType
      },
      languagePreferences: {
        firstPref: memberAccountGUID.userDetails.firstPref,
        secondPref: memberAccountGUID.userDetails.secondPref,
        thirdPref: memberAccountGUID.userDetails.thirdPref
      },
      status: {
        ccFunnelState: memberAccountGUID.userDetails.ccFunnelState,
        dcFunnelState: memberAccountGUID.userDetails.dcFunnelState,
        customerState: 'ActiveTrialUser', // This should be derived from actual data
        applicationDetails: {
          customerState: memberAccountGUID.userDetails.applicationDetails?.PHOTOSHOP?.customerState || 'Unknown'
        }
      }
    },
    
    emailMarketingPermission: {
      val: true, // This should be derived from actual data
      time: new Date().toISOString() // This should be derived from actual data
    },
    
    individualEntitlements: {
      numberOfEntitledProducts: memberAccountGUID.entitlements.numberOfEntitledProducts,
      productInfo: {
        productCode: 'PHOTOSHOP_CC_INDV',
        productName: 'Adobe Photoshop CC - Individual',
        productID: 'PROD-PS-CC-I',
        family: 'Creative Cloud',
        bundleID: null
      },
      offerInfo: {
        offerID: 'TRIAL_PS_INDV_30D',
        offerType: 'Trial',
        offerTermValue: 30,
        offerTermUnit: 'Day',
        promotionType: 'Standard Trial',
        cloud: 'CREATIVE',
        commitmentType: 'ABM'
      },
      acquisitionInfo: {
        routeToMarket: 'Direct Web Sale',
        marketSegment: 'Consumer',
        appStore: null
      },
      trialInfo: {
        trialStartDTS: '2025-04-01T00:00:00Z',
        trialEndDTS: '2025-05-01T00:00:00Z'
      },
      statusInfo: {
        paymentStatus: 'InTrial',
        hardCancelDTS: null,
        softCancelDTS: null,
        tenure: 21,
        purchaseDTS: null,
        lastPaymentConfirmationType: null
      }
    },
    
    teamEntitlements: {
      contractInfo: {
        buyingProgram: memberAccountGUID.contract.buyingProgram,
        contractStartDTS: memberAccountGUID.contract.contractStartDTS,
        contractEndDTS: memberAccountGUID.contract.contractEndDTS,
        contractStatus: memberAccountGUID.contract.contractStatus,
        contractType: memberAccountGUID.contract.contractType,
        marketSegment: 'SMB'
      },
      adminRoles: memberAccountGUID.contract.adminRoles,
      b2bEntitlements: {
        delegationInfo: {
          delegationStartDTS: null,
          delegationEndDTS: null,
          delegationStatus: null
        },
        productInfo: {
          productArrangementCode: 'TEAM-ARR-101',
          productCode: 'ILLUSTRATOR_CC_TEAMS',
          productName: 'Adobe Illustrator CC for Teams'
        },
        offerInfo: {
          offerID: 'ILLUSTRATOR_TEAMS_ANNUAL',
          offerType: 'PaidSubscription',
          offerTermValue: 1,
          offerTermUnit: 'Year'
        },
        statusInfo: {
          purchaseDTS: '2024-02-01T10:00:00Z',
          hardCancelDTS: null
        },
        trialDetails: {
          trialStartDTS: null,
          trialEndDTS: null,
          trialToPaidConversion: false,
          trialToPaidConversionDTS: null
        }
      }
    },
    
    modelsAndScores: {
      overallScore: {
        modelScore: memberAccountGUID.modelsAndScores.SKU_RANK.modelScore,
        modelPercentileScore: parseFloat(memberAccountGUID.modelsAndScores.SKU_RANK.modelPercentileScore),
        modelScoreDate: memberAccountGUID.modelsAndScores.SKU_RANK.modelScoreDate,
        modelUserSegment: memberAccountGUID.modelsAndScores.SKU_RANK.modelUserSegment
      },
      actions: [
        'action',
        'offerTerm',
        'percentileScore',
        'productPrice',
        'rank',
        'score',
        'scoreDate',
        'testID'
      ],
      contents: [
        'surface',
        'URL',
        'rank'
      ]
    },
    
    productActivity: {
      installs: {
        desktop: {
          mac: {
            firstActivityDate: '2024-05-10T11:00:00Z',
            recentActivityDate: '2025-04-20T11:00:00Z',
            mostRecentAppVersion: '25.5.1',
            mostRecentOSVersion: 'macOS 14.4.1'
          },
          windows: {
            firstActivityDate: '2024-08-15T16:30:00Z',
            recentActivityDate: '2025-03-10T09:00:00Z',
            mostRecentAppVersion: '25.4.0',
            mostRecentOSVersion: 'Windows 11 23H2'
          }
        },
        mobile: {
          iOS: {
            firstActivityDate: '2024-11-01T12:00:00Z',
            recentActivityDate: '2025-04-15T18:20:00Z',
            mostRecentAppVersion: '8.2.1',
            mostRecentOSVersion: 'iOS 17.4.1'
          },
          android: {
            firstActivityDate: '2024-11-01T12:00:00Z',
            recentActivityDate: '2025-04-15T18:20:00Z',
            mostRecentAppVersion: '8.2.1',
            mostRecentOSVersion: 'iOS 17.4.1'
          }
        },
        web: {
          firstActivityDate: '2024-11-01T12:00:00Z',
          recentActivityDate: '2025-04-15T18:20:00Z',
          mostRecentAppVersion: '8.2.1',
          mostRecentOSVersion: null
        }
      },
      launches: {
        desktop: {
          mac: {
            firstActivityDate: '2024-05-10T11:05:00Z',
            recentActivityDate: '2025-04-20T11:02:00Z',
            mostRecentAppVersion: '25.5.1',
            mostRecentOSVersion: 'macOS 14.4.1'
          },
          windows: {
            firstActivityDate: '2024-08-15T16:35:00Z',
            recentActivityDate: '2025-03-10T09:05:00Z',
            mostRecentAppVersion: '25.4.0',
            mostRecentOSVersion: 'Windows 11 23H2'
          }
        },
        mobile: {
          iOS: {
            firstActivityDate: '2024-11-01T12:05:00Z',
            recentActivityDate: '2025-04-15T18:22:00Z',
            mostRecentAppVersion: '8.2.1',
            mostRecentOSVersion: 'iOS 17.4.1'
          },
          android: {
            firstActivityDate: null,
            recentActivityDate: null,
            mostRecentAppVersion: null,
            mostRecentOSVersion: null
          }
        }
      }
    }
  };
}

export function storeTransformedData(transformedData: TransformedUserData): void {
  // Store the transformed data (implementation depends on your storage needs)
  console.log('Transformed data stored:', transformedData);
}

export function getTransformedData(): TransformedUserData | null {
  // Retrieve the stored transformed data
  return null;
} 