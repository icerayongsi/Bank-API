export default {
    kbank: {
        sandbox: {
            oAuthV2: "https://openapi-sandbox.kasikornbank.com/v2/oauth/token",
            verifyData: "https://openapi-sandbox.kasikornbank.com/v1/fundtransfer/verifydata",
            fundTransfer: "https://openapi-sandbox.kasikornbank.com/v1/fundtransfer/fundtransfer",
            inquiryOtherBankAC: "https://openapi-sandbox.kasikornbank.com/v1/fundtransfer/verifydata",
            transferOtherBankAC: "https://openapi-sandbox.kasikornbank.com/v1/fundtransfer/verifydata",
            twoway_ssl : "https://openapi-test.kasikornbank.com/exercise/ssl"
        },
        dev: {
            oAuthV2: "https://openapi-test.kasikornbank.com/v2/oauth/token",
            verifyData: "https://openapi-test.kasikornbank.com/v1/fundtransfer/verifydata",
            fundTransfer: "https://openapi-test.kasikornbank.com/v1/fundtransfer/fundtransfer",
            inqueryTxnStatus: "https://openapi-test.kasikornbank.com/v1/fundtransfer/inqtxnstatus"
        },
        prod: {
            oAuthV2: "https://openapi.kasikornbank.com/v2/oauth/token",
            verifyData: "https://openapi.kasikornbank.com/fundtransfer/verifydata",
            fundTransfer: "https://openapi.kasikornbank.com/fundtransfer/fundtransfer",
            inqueryTxnStatus: "https://openapi.kasikornbank.com/fundtransfer/inqtxnstatus"
        }
    },
    cimb : {
        dev : {
            oAuthTokenV2CIMB : "https://partneruat.cimbthai.com/capgw/oauth/v1.0/partner/token",
            inquiryAccountV2CIMB : "https://partneruat.cimbthai.com/capgw/opay/OpayWebAPI/v1/PromptPay/ProxyCredit/RealTime/Inquire",
            confirmFunsTransferV2CIMB : "https://partneruat.cimbthai.com/capgw/opay/OpayWebAPI/v1/PromptPay/ProxyCredit/RealTime/Confirm",
            getStatusV2CIMB : "https://partneruat.cimbthai.com/capgw/opay/OpayWebAPI/v1/GetStatus",
        },
        prod : {
            oAuthTokenV2CIMB : "https://partner.cimbthai.com/capgw/oauth/v1.0/partner/token",
            inquiryAccountV2CIMB : "https://partner.cimbthai.com/capgw/opay/OpayWebAPI/v1/PromptPay/ProxyCredit/RealTime/Inquire",
            confirmFunsTransferV2CIMB : "https://partner.cimbthai.com/capgw/opay/OpayWebAPI/v1/PromptPay/ProxyCredit/RealTime/Confirm",
            getStatusV2CIMB : "https://partner.cimbthai.com/capgw/opay/OpayWebAPI/v1/GetStatus",
        }
    }
}