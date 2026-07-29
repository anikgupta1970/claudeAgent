export default {
  step1: {
    title: "सावधि जमा खाता",
    customerDetails: "ग्राहक विवरण",
    mobileNumber: "मोबाइल नंबर",
    mobileNumberPlaceholder: "मोबाइल नंबर दर्ज करें",
    dateOfBirth: "जन्म तिथि",
    pan: "Pan Number",
    verifyUsing: "सत्यापन का तरीका",
    termsText: "पूरी जानकारी के लिए हमारे पढ़ें",
    termsLink: "नियम और शर्तें",
    privacyLink: "गोपनीयता नीति",
    continue: "जारी रखें",
    processing: "प्रोसेसिंग...",
    errors: {
      mobileRequired: "मोबाइल नंबर आवश्यक है",
      mobileDigits: "मोबाइल नंबर 10 अंकों का होना चाहिए",
      dobRequired: "जन्म तिथि आवश्यक है",
      consentRequired: "आवश्यक सहमति स्वीकार की जानी चाहिए"
    }
  },
  step2: {
    depositDetails: "सावधि जमा विवरण",
    clickHere: "यहाँ क्लिक करें",
    interestRates: "ब्याज दरें और अधिक देखने के लिए",
    customerDetails: "ग्राहक विवरण",
    fullName: "पूरा नाम",
    dateOfBirth: "जन्म तिथि",
    pan: "पैन",
    selectFDType: "FD प्रकार चुनें",
    withdrawableFD: "निकासी योग्य FD",
    nonWithdrawableFD: "गैर-निकासी योग्य FD",
    withdrawableDesc: "आंशिक/समयपूर्व निकासी की अनुमति है",
    nonWithdrawableDesc: "उच्च ब्याज, समयपूर्व निकासी नहीं",
    fdAmount: "FD राशि (₹)",
    enterFDAmount: "FD राशि दर्ज करें",
    interestPayout: "ब्याज भुगतान",
    interestPayoutMonthly: "मासिक",
    interestPayoutQuarterly: "त्रैमासिक",
    interestPayoutAtMaturity: "परिपक्वता पर",
    interestPayoutMonthlyDesc: "हर महीने ब्याज का भुगतान",
    interestPayoutQuarterlyDesc: "हर फिक्स्ड 3 महीने के लिए ब्याज",
    interestPayoutAtMaturityDesc: "अल्पकालिक FD 7 से 180 दिन",
    maturityInstructions: "परिपक्वता निर्देश",
    maturityInfoMessage: "परिपक्वता पर राशि स्रोत खाते में स्थानांतरित की जाएगी।",
    tenure: "अवधि",
    years: "वर्ष",
    months: "महीने",
    days: "दिन",
    atMaturityNote: "नोट: \"परिपक्वता पर\" भुगतान विकल्प के लिए, अवधि 7 से 180 दिन के बीच होनी चाहिए।",
    calculateFD: "FD विवरण की गणना करें",
    calculating: "गणना हो रही है...",
    calculateInfo: "परिपक्वता राशि और ब्याज विवरण की गणना करने के लिए क्लिक करें",
    maturityDetails: "परिपक्वता विवरण",
    rateOfInterest: "ब्याज दर",
    maturityAmount: "परिपक्व राशि",
    maturityDate: "परिपक्वता तिथि",
    interestEarned: "अर्जित ब्याज",
    continue: "जारी रखें",
    errors: {
      productVariant: "कृपया प्रोडक्ट वैरिएंट चुनें",
      productDetails: "प्रोडक्ट विवरण उपलब्ध नहीं हैं। कृपया पुनः प्रयास करें या दूसरा प्रोडक्ट चुनें।",
      eligibility: "यह प्रोडक्ट {minAge} और {maxAge} वर्ष की आयु के ग्राहकों के लिए उपलब्ध है।",
      amount: "कृपया FD राशि दर्ज करें",
      invalidAmount: "कृपया वैध FD राशि दर्ज करें",
      minAmount: "न्यूनतम जमा राशि ₹{amount} है",
      maxAmount: "अधिकतम जमा राशि ₹{amount} है",
      amountRange: "न्यूनतम: ₹{minAmount} और अधिकतम: ₹{maxAmount} के बीच जमा राशि दर्ज करें",
      interestPayout: "कृपया ब्याज भुगतान विकल्प चुनें",
      invalidInterestPayout: "चयनित ब्याज भुगतान विकल्प इस प्रोडक्ट के लिए उपलब्ध नहीं है",
      interestPayoutMaturity: "परिपक्वता पर विकल्प केवल 7 से 180 दिनों की अवधि वाले FD के लिए उपलब्ध है",
      monthlyQuarterlyTenure: "मासिक/त्रैमासिक भुगतान के लिए 180 दिनों या 6 महीने से अधिक की अवधि आवश्यक है",
      maturityInstructions: "कृपया परिपक्वता निर्देश चुनें",
      invalidMaturityInstructions: "चयनित परिपक्वता निर्देश इस प्रोडक्ट के लिए उपलब्ध नहीं है",
      tenure: "न्यूनतम अवधि {tenure} होनी चाहिए",
      maxTenure: "अधिकतम अवधि {tenure} होनी चाहिए"
    }
  },
  step3: {
    bankDetails: "बैंक विवरण",
    fdFundingAmount: "FD फंडिंग राशि",
    fundYourFdVia: "अपनी FD को इसके माध्यम से फंड करें",
    otherBank: "अन्य बैंक",
    hdfcBank: "HDFC बैंक",
    combinedFunds: "संयुक्त फंड",
    addAccount: "खाता जोड़ें",
    otherBankAccount: "अन्य बैंक खाता",
    accountNumber: "खाता संख्या",
    ifsc: "IFSC",
    bank: "बैंक",
    maturityAccount: "परिपक्वता खाता",
    maturityAccountDesc: "परिपक्वता राशि इस HDFC बैंक खाते में जमा की जाएगी। FD इसी संबंध के अनुसार बुक की जाएगी।",
    accountType: "खाता प्रकार",
    availableBalance: "उपलब्ध शेष राशि",
    branch: "शाखा",
    selectBranch: "शाखा चुनें",
    fdBookedBranch: "FD इस शाखा में बुक की जाएगी",
    nominee: "नामांकित व्यक्ति",
    addNomineeLabel: "FD में नामांकित व्यक्ति जोड़ें (दृढ़ता से अनुशंसित)",
    fullName: "पूरा नाम",
    relationship: "संबंध",
    dateOfBirth: "जन्म तिथि",
    guardianDetails: "अभिभावक विवरण",
    guardiansAddress: "अभिभावक का पता",
    accountDetails: "खाता विवरण",
    amountFromHdfc: "HDFC से राशि",
    amountFromOtherBank: "अन्य बैंक से राशि",
    continue: "जारी रखें",
    loading: {
      loadingAccountDetails: "खाता विवरण लोड हो रहा है...",
      loadingProductOptions: "प्रोडक्ट विकल्प लोड हो रहे हैं..."
    }
  },
  step4: {
    bankDetails: "बैंक विवरण",
    fixedDepositAccount: "सावधि जमा खाता",
    customerDetails: "ग्राहक विवरण",
    fullName: "पूरा नाम",
    dateOfBirth: "जन्म तिथि",
    pan: "पैन",
    mobileNumber: "मोबाइल नंबर",
    fixedDepositDetails: "सावधि जमा विवरण",
    fixedDepositAmount: "सावधि जमा राशि",
    tenure: "अवधि",
    interestPayout: "ब्याज भुगतान",
    maturityInstructions: "परिपक्वता निर्देश",
    rateOfInterest: "ब्याज दर",
    rateOfInterestSuffix: "प्रति वर्ष",
    maturityAmount: "परिपक्वता राशि",
    maturityDate: "परिपक्वता तिथि",
    branch: "शाखा",
    bankAccountDetails: "बैंक खाता विवरण",
    accountNumber: "खाता संख्या",
    bankName: "बैंक का नाम",
    ifscCode: "IFSC कोड",
    nomineeDetails: "नामांकित विवरण",
    relationship: "संबंध",
    guardianDetails: "अभिभावक विवरण",
    guardianName: "अभिभावक का नाम",
    guardianDateOfBirth: "अभिभावक की जन्म तिथि",
    confirm: "पुष्टि करें",
    interestPayoutOptions: {
      reinvest: "पुनर्निवेश",
      quarterly: "त्रैमासिक ब्याज भुगतान",
      monthly: "मासिक ब्याज भुगतान",
      onMaturity: "परिपक्वता पर"
    },
    tenureFormat: {
      year: "वर्ष",
      years: "वर्ष",
      month: "महीना",
      months: "महीने",
      day: "दिन",
      days: "दिन"
    }
  },
  step5: {
    fundYourFD: "अपनी FD फंड करें",
    choosePaymentMethod: "अपनी सावधि जमा खाते को फंड करने के लिए भुगतान विधि चुनें",
    paymentMethods: {
      netbanking: "नेटबैंकिंग",
      upi: "यूपीआई"
    },
    upi: {
      enterUpiId: "अपना यूपीआई आईडी दर्ज करें",
      upiIdPlaceholder: "आपकानाम@upi",
      verify: "सत्यापित करें",
      verifying: "सत्यापित हो रहा है...",
      verified: "सत्यापित",
      verifiedSuccess: "यूपीआई आईडी सफलतापूर्वक सत्यापित की गई"
    },
    buttons: {
      back: "वापस",
      payNow: "अभी भुगतान करें",
      processing: "प्रसंस्करण हो रहा है..."
    },
    errors: {
      enterUpiId: "कृपया यूपीआई आईडी दर्ज करें",
      invalidUpiFormat: "अमान्य यूपीआई आईडी प्रारूप",
      nameMismatch: "यूपीआई आईडी के साथ नाम मेल नहीं खाता",
      unableToVerify: "यूपीआई आईडी सत्यापित करने में असमर्थ",
      verificationError: "सत्यापन के दौरान त्रुटि। कृपया पुनः प्रयास करें",
      verifyBeforeProceeding: "आगे बढ़ने से पहले कृपया अपना यूपीआई आईडी सत्यापित करें",
      submissionError: "फॉर्म जमा करने में त्रुटि। कृपया पुनः प्रयास करें"
    }
  },
  upiPayment: {
    payingTo: "भुगतान किया जा रहा है",
    upiId: "यूपीआई आईडी",
    chooseOption: "परीक्षण के लिए, भुगतान परिणाम चुनें:",
    success: "सफल",
    failure: "विफल",
    back: "भुगतान विधियों पर वापस जाएं"
  },
  netbankingPayment: {
    chooseOption: "परीक्षण के लिए, भुगतान परिणाम चुनें:",
    success: "सफल",
    failure: "विफल",
    back: "भुगतान विधियों पर वापस जाएं"
  },
  paymentFailed: {
    title: "भुगतान विफल",
    referenceId: "संदर्भ आईडी",
    contactSupport: "यदि समस्या बनी रहती है, तो कृपया हमारे सहायता टीम से संपर्क करें।"
  },
  step6: {
    fixedDepositAccount: "सावधि जमा खाता",
    applicationSubmitted: "आवेदन जमा किया गया",
    fdAccountOpened: "FD खाता शीघ्र ही खोला जाएगा",
    applicationSummary: "आवेदन सारांश",
    transactionRefNo: "लेनदेन संदर्भ संख्या:",
    dateTime: "दिनांक और समय",
    accountType: "खाता प्रकार",
    accountNumber: "खाता संख्या",
    customerName: "ग्राहक का नाम",
    mobileNumber: "मोबाइल नंबर",
    fixedDepositAmount: "सावधि जमा राशि",
    tenure: "अवधि",
    maturityDate: "परिपक्वता तिथि",
    interestRate: "ब्याज दर",
    maturityAmount: "परिपक्वता राशि",
    branch: "शाखा",
    nomineeDetails: "नामांकित विवरण",
    nomineeName: "नामांकित का नाम",
    relationship: "संबंध",
    backToHome: "होम पर वापस जाएं",
    tenureFormat: {
      year: "वर्ष",
      years: "वर्ष",
      month: "महीना",
      months: "महीने",
      day: "दिन",
      days: "दिन"
    }
  },
  accountDetails: {
    title: "अन्य बैंक खाता",
    accountNumber: "खाता संख्या",
    accountNumberPlaceholder: "खाता संख्या दर्ज करें",
    confirmAccountNumber: "खाता संख्या की पुष्टि करें",
    confirmAccountNumberPlaceholder: "खाता संख्या पुनः दर्ज करें",
    ifsc: "IFSC",
    ifscPlaceholder: "IFSC कोड दर्ज करें",
    clickToSearch: "IFSC कोड खोजने के लिए यहां क्लिक करें",
    verifyingIFSC: "IFSC सत्यापित हो रहा है...",
    accountVerified: "खाता सफलतापूर्वक सत्यापित किया गया",
    confirm: "पुष्टि करें",
    searchIFSC: {
      title: "IFSC कोड खोजें",
      bank: "बैंक",
      selectBank: "बैंक चुनें",
      branch: "शाखा",
      selectBranch: "शाखा चुनें",
      branchDetails: "शाखा पता और IFSC कोड",
      ifscCodeLabel: "IFSC कोड - "
    },
    errors: {
      accountRequired: "खाता संख्या आवश्यक है",
      accountMinLength: "खाता संख्या कम से कम 8 अंकों की होनी चाहिए",
      accountNotValidated: "खाता संख्या सत्यापित नहीं की गई",
      confirmRequired: "कृपया खाता संख्या की पुष्टि करें",
      confirmMismatch: "खाता संख्याएँ मेल नहीं खातीं",
      ifscRequired: "IFSC आवश्यक है",
      invalidIfsc: "अमान्य IFSC कोड",
      failedValidation: "IFSC कोड का सत्यापन करने में असमर्थ",
      nameMismatch: "खाता धारक का नाम हमारे रिकॉर्ड से मेल नहीं खाता",
      unableToVerify: "खाता सत्यापित करने में असमर्थ। कृपया विवरण जांचें और पुनः प्रयास करें",
      verificationError: "सत्यापन के दौरान त्रुटि हुई। कृपया बाद में पुनः प्रयास करें"
    }
  },
  branchSearch: {
    title: "शाखा खोजें",
    searchModes: {
      location: "स्थान",
      pincode: "पिनकोड"
    },
    location: {
      state: "राज्य",
      city: "शहर",
      branch: "शाखा",
      selectPlaceholder: "चुनें",
      loadingStates: "राज्य लोड हो रहे हैं...",
      loadingCities: "शहर लोड हो रहे हैं...",
      loadingBranches: "शाखाएँ लोड हो रही हैं...",
      noOptions: "कोई विकल्प नहीं"
    },
    pincode: {
      pincode: "पिन-कोड",
      pincodePlaceholder: "6-अंकों का पिनकोड दर्ज करें",
      branch: "शाखा",
      noOptions: "कोई विकल्प नहीं"
    },
    branchDetails: "शाखा पता और IFSC कोड",
    ifscCodeLabel: "IFSC कोड - ",
    confirm: "पुष्टि करें",
    errors: {
      failedLoadStates: "राज्य लोड करने में विफल। कृपया पुनः प्रयास करें।",
      noCitiesAvailable: "इस राज्य में कोई शहर उपलब्ध नहीं हैं",
      failedLoadCities: "शहर लोड करने में विफल। कृपया पुनः प्रयास करें।",
      noBranchesAvailable: "इस स्थान पर कोई शाखाएँ उपलब्ध नहीं हैं",
      failedLoadBranches: "शाखाएँ लोड करने में विफल। कृपया पुनः प्रयास करें।",
      noBranchesForPincode: "इस पिनकोड के लिए कोई शाखाएँ नहीं मिलीं",
      failedFindBranch: "शाखा खोजने में विफल। कृपया दूसरा पिनकोड आज़माएँ"
    }
  },
  branchSelector: {
    title: "शाखा खोजें",
    searchTypes: {
      text: "टेक्स्ट द्वारा खोजें",
      pincode: "पिनकोड द्वारा खोजें"
    },
    textSearch: {
      label: "शाखा खोजें",
      placeholder: "शाखा का नाम, शहर, राज्य या जिला द्वारा खोजें"
    },
    pincodeSearch: {
      label: "पिनकोड दर्ज करें",
      placeholder: "6-अंकों का पिनकोड दर्ज करें"
    },
    loading: "लोड हो रहा है...",
    noBranchesFound: "कोई शाखाएँ नहीं मिलीं। अलग खोज का प्रयास करें।",
    branchDetails: {
      ifscLabel: "IFSC:"
    },
    buttons: {
      cancel: "रद्द करें"
    }
  },
  ifscSelector: {
    title: "IFSC द्वारा शाखा खोजें",
    ifscCode: {
      label: "IFSC कोड",
      placeholder: "11-अंकों का IFSC कोड दर्ज करें",
      search: "खोजें"
    },
    bankName: {
      label: "बैंक का नाम",
      placeholder: "बैंक का नाम यहाँ दिखाई देगा",
      selectFromList: "सूची से चुनें"
    },
    branchDetails: {
      title: "शाखा विवरण",
      bankName: "बैंक का नाम",
      branch: "शाखा",
      address: "पता",
      city: "शहर",
      state: "राज्य",
      ifscCode: "IFSC कोड"
    },
    buttons: {
      cancel: "रद्द करें",
      confirm: "पुष्टि करें"
    },
    errors: {
      lengthError: "IFSC कोड 11 अक्षरों का होना चाहिए",
      formatError: "अमान्य IFSC कोड प्रारूप",
      bankNotFound: "इस IFSC कोड के लिए बैंक नहीं मिला"
    }
  },
  nominee: {
    fullName: "पूरा नाम",
    relationship: "संबंध",
    dateOfBirth: "जन्म तिथि",
    nomineeName: "नॉमिनी का नाम",
    guardianDetails: "अभिभावक विवरण",
    guardianNote: "अभिभावक उस ग्राहक से अलग होना चाहिए जो यह खाता खोल रहा है",
    addNominee: "नॉमिनी जोड़ें",
    selectRelationship: "संबंध चुनें",
    confirm: "पुष्टि करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    errors: {
      nomineeNameRequired: "नॉमिनी का नाम आवश्यक है",
      nomineeNameSpecialChar: "नॉमिनी के नाम में विशेष वर्ण नहीं हो सकते",
      relationshipRequired: "संबंध आवश्यक है",
      dobRequired: "जन्म तिथि आवश्यक है",
      guardianNameRequired: "अभिभावक का नाम आवश्यक है",
      guardianDobRequired: "अभिभावक की जन्म तिथि आवश्यक है"
    },
    relationships: {
      FATHER: "पिता",
      MOTHER: "माता",
      SON: "पुत्र",
      DAUGHTER: "पुत्री",
      BROTHER: "भाई",
      SISTER: "बहन",
      GRANDFATHER: "दादा",
      GRANDMOTHER: "दादी",
      HUSBAND: "पति",
      WIFE: "पत्नी",
      AUNT: "चाची/मौसी",
      UNCLE: "चाचा/मामा",
      GUARDIAN: "अभिभावक",
      SELF: "स्वयं",
      NIECE: "भतीजी/भांजी",
      NEPHEW: "भतीजा/भांजा",
      "Grand son": "पोता",
      OTHERS: "अन्य"
    }
  },
  otp: {
    title: "ओटीपी दर्ज करें",
    close: "बंद करें",
    instruction: "कृपया आपके मोबाइल नंबर {{mobile}} पर भेजा गया ओटीपी दर्ज करें",
    instructionMasked: "कृपया आपके मोबाइल नंबर {{mobile}} पर भेजा गया ओटीपी दर्ज करें",
    digitLabel: "ओटीपी अंक {{number}}",
    submit: "सबमिट करें",
    verifying: "सत्यापन हो रहा है...",
    resendOtp: "ओटीपी पुनः भेजें",
    resendOtpTimer: "{{seconds}} सेकंड में ओटीपी पुनः भेजें",
    errors: {
      invalidOtp: "अमान्य ओटीपी। कृपया पुनः प्रयास करें।",
      verificationFailed: "सत्यापन के दौरान त्रुटि हुई। कृपया पुनः प्रयास करें।",
      resendFailed: "ओटीपी पुनः भेजने में विफल। कृपया पुनः प्रयास करें।"
    }
  },
  common: {
    accept: "स्वीकार करें",
    displayingFallback: "फॉलबैक सामग्री प्रदर्शित की जा रही है:",
    viewDocument: "दस्तावेज़ देखें",
    termsLoadFailed: "नियम लोड करने में असमर्थ। कृपया बाद में पुनः प्रयास करें।",
    consentDetails: "सहमति विवरण",
    summary: "संक्षिप्त विवरण",
    details: "विस्तृत विवरण",
    loadingConsents: "सहमति जानकारी लोड हो रही है...",
    viewFullTerms: "पूर्ण नियम देखें",
    and: "और",
    refreshPage: "पेज रिफ्रेश करें",
    close: "बंद करें",
    save: "सहेजें",
    cancel: "रद्द करें",
    continue: "जारी रखें"
  }
};