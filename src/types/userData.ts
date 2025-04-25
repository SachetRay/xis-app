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
  adobeCorpnew: {
    memberAccountGUID: {
      userDetails: {
        userAccountCreationDate: string;
      };
    };
    isAdobeEmployee: string;
    emailDomain: string;
    hashedEmail: string;
    emailValidFlag: string;
  };
  personalEmail: {
    address: string;
  };
} 