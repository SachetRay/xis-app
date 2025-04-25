import { UserData } from '../data/userData';
import { TransformedUserData } from '../types/transformedUserData';

export function transformUserData(userData: UserData): TransformedUserData {
  return {
    userDetails: {
      identity: {
        firstName: userData.person.name.firstname,
        lastName: userData.person.name.lastname,
        countryCode: userData.homeAddress.countryCode,
        userAccountCreationDate: userData.adobeCorpnew.memberAccountGUID.userDetails.userAccountCreationDate,
        isAdobeEmployee: userData.adobeCorpnew.isAdobeEmployee === "YES"
      },
      email: {
        address: userData.personalEmail.address,
        emailDomain: userData.adobeCorpnew.emailDomain,
        hashedEmail: userData.adobeCorpnew.hashedEmail,
        emailValidFlag: userData.adobeCorpnew.emailValidFlag === "YES"
      },
      authentication: {
        authenticationSource: userData.adobeCorpnew.memberAccountGUID.userDetails.authenticationSource,
        authenticationSourceType: userData.adobeCorpnew.memberAccountGUID.userDetails.authenticationSourceType,
        signupSourceName: userData.adobeCorpnew.memberAccountGUID.userDetails.signupSourceName,
        signupSocialAccount: userData.adobeCorpnew.memberAccountGUID.userDetails.signupSocialAccount,
        signupCategory: userData.adobeCorpnew.memberAccountGUID.userDetails.signupCategory
      },
      accountSystemInfo: {
        type2eLinkedStatus: userData.adobeCorpnew.memberAccountGUID.userDetails.type2eLinkedStatus,
        linkToType2e: userData.adobeCorpnew.memberAccountGUID.userDetails.linkToType2e,
        type2eParentType: userData.adobeCorpnew.memberAccountGUID.userDetails.type2eParentType
      },
      languagePreferences: {
        firstPref: userData.adobeCorpnew.memberAccountGUID.userDetails.firstPref,
        secondPref: userData.adobeCorpnew.memberAccountGUID.userDetails.secondPref,
        thirdPref: userData.adobeCorpnew.memberAccountGUID.userDetails.thirdPref
      },
      status: {
        ccFunnelState: userData.adobeCorpnew.memberAccountGUID.userDetails.ccFunnelState,
        dcFunnelState: userData.adobeCorpnew.memberAccountGUID.userDetails.dcFunnelState,
        applicationDetails: {
          customerState: userData.adobeCorpnew.memberAccountGUID.userDetails.applicationDetails.customerState
        }
      }
    },
    emailMarketingPermission: {
      val: true, // This should be derived from actual data if available
      time: new Date().toISOString() // This should be derived from actual data if available
    },
    individualEntitlements: {
      numberOfEntitledProducts: userData.adobeCorpnew.memberAccountGUID.entitlements.numberOfEntitledProducts,
      productInfo: {
        productCode: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.productCode,
        productName: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.productName,
        productID: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.productID,
        family: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.family,
        bundleID: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.bundleID
      },
      offerInfo: {
        offerID: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.offerID,
        offerType: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.offerType,
        offerTermValue: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.offerTermValue,
        offerTermUnit: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.offerTermUnit,
        promotionType: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.promotionType || "",
        cloud: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.cloud,
        commitmentType: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.commitmentType
      },
      acquisitionInfo: {
        routeToMarket: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.routeToMarket,
        marketSegment: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.marketSegment,
        appStore: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.appStore
      },
      trialInfo: {
        trialStartDTS: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.trialStartDTS,
        trialEndDTS: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.trialEndDTS
      },
      statusInfo: {
        paymentStatus: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.paymentStatus,
        hardCancelDTS: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.hardCancelDTS,
        softCancelDTS: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.softCancelDTS,
        tenure: parseInt(userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.tenure) || 0,
        purchaseDTS: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.purchaseDTS,
        lastPaymentConfirmationType: userData.adobeCorpnew.memberAccountGUID.entitlements.phsp_direct_individual.keyConfirmationType
      }
    },
    teamEntitlements: {
      contractInfo: {
        buyingProgram: userData.adobeCorpnew.memberAccountGUID.contract.buyingProgram,
        contractStartDTS: userData.adobeCorpnew.memberAccountGUID.contract.contractStartDTS,
        contractEndDTS: userData.adobeCorpnew.memberAccountGUID.contract.contractEndDTS,
        contractStatus: userData.adobeCorpnew.memberAccountGUID.contract.contractStatus,
        contractType: userData.adobeCorpnew.memberAccountGUID.contract.contractType,
        marketSegment: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.marketSegment
      },
      adminRoles: userData.adobeCorpnew.memberAccountGUID.contract.adminRoles,
      b2bEntitlements: {
        delegationInfo: {
          delegationStartDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.delegationStartDTS,
          delegationEndDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.delegationEndDTS,
          delegationStatus: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.delegationStatus
        },
        productInfo: {
          productArrangementCode: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.productArrangementCode,
          productCode: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.productCode,
          productName: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.productName
        },
        offerInfo: {
          offerID: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.offerID,
          offerType: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.offerType,
          offerTermValue: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.offerTermValue,
          offerTermUnit: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.offerTermUnit
        },
        statusInfo: {
          purchaseDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.purchaseDTS,
          hardCancelDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.hardCancelDTS
        },
        trialDetails: {
          trialStartDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.trialStartDTS,
          trialEndDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.trialEndDTS,
          trialToPaidConversion: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.trialToPaidConversion === "TRUE",
          trialToPaidConversionDTS: userData.adobeCorpnew.memberAccountGUID.contract.b2bEntitlements.trialToPaidConversionDTS
        }
      }
    },
    modelsAndScores: {
      overallScore: {
        modelScore: userData.adobeCorpnew.memberAccountGUID.modelsAndScores.modelScore,
        modelPercentileScore: parseFloat(userData.adobeCorpnew.memberAccountGUID.modelsAndScores.modelPercentileScore),
        modelScoreDate: userData.adobeCorpnew.memberAccountGUID.modelsAndScores.modelScoreDate,
        modelUserSegment: userData.adobeCorpnew.memberAccountGUID.modelsAndScores.modelUserSegment
      },
      actions: userData.adobeCorpnew.memberAccountGUID.modelsAndScores.actions.map(action => action.action),
      contents: userData.adobeCorpnew.memberAccountGUID.modelsAndScores.contents.map(content => content.URL)
    },
    productActivity: {
      installs: {
        desktop: {
          mac: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.mac.mostRecentOSVersion
          },
          windows: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.windows.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.windows.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.windows.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.desktop.windows.mostRecentOSVersion
          }
        },
        mobile: {
          iOS: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.iOS.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.iOS.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.iOS.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.iOS.mostRecentOSVersion
          },
          android: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.android.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.android.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.android.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.mobile.android.mostRecentOSVersion
          }
        },
        web: {
          firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.web.firstActivityDate,
          recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.web.recentActivityDate,
          mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.web.mostRecentAppVersion,
          mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appInstalls.web.mostRecentOSVersion
        }
      },
      launches: {
        desktop: {
          mac: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.mac.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.mac.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.mac.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.mac.mostRecentOSVersion
          },
          windows: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.windows.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.windows.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.windows.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.desktop.windows.mostRecentOSVersion
          }
        },
        mobile: {
          iOS: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.iOS.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.iOS.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.iOS.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.iOS.mostRecentOSVersion
          },
          android: {
            firstActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.android.firstActivityDate,
            recentActivityDate: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.android.recentActivityDate,
            mostRecentAppVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.android.mostRecentAppVersion,
            mostRecentOSVersion: userData.adobeCorpnew.memberAccountGUID.appUsage.appLaunches.mobile.android.mostRecentOSVersion
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