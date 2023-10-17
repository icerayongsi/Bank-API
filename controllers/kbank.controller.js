import { RequestFunction, c_time } from "#Utils/utility.func"
import { SessionManager } from "#Services/redis.service"
import { KBANKService } from "#Services/banks.service"
import { logger } from "#Utils/logger"
import * as kbank from "#Utils/kbank.func"
import * as endpoint from "#constants/endpoints"
import moment from "moment"


export class KBANKController {

    #mode = process.env.NODE_ENV
    #session = new SessionManager()
    #service = new KBANKService()
    #bankNameInit = kbank.constants.bankNameInit.toUpperCase()

    /**
     * verifyData (Inquiry data)
     * Last edit @date 10/16/2023 - 5:01:56 AM by Thadthep thadsri
     *
     * **/
    verifyData = async (req, res) => {
        const { unique_key, coop_key, customerMobileNo } = req.body
        try {
            const payer = await this.#service.GetPayerInfo(coop_key)
            const obj = {
                headers: {
                    "Authorization": `Bearer ${(await this.#session.getAuth(unique_key, this.#bankNameInit))}`,
                    "Content-Type": "application/json",
                },
                body: {
                    amount: req.body.amount,
                    fromAccountNo: payer.payer_account,
                    merchantID: payer.merchant_id,
                    merchantTransID: `${payer.merchant_id}_${moment().format('YYYYMMDD')}_${req.body.ref_no}`,
                    proxyType: "10",
                    proxyValue: req.body.bank_account_no,
                    requestDateTime: moment().format('yyyy-MM-DDTHH:mm:ss.SSS+07:00'),
                    senderName: payer.service_name,
                    senderTaxID: req.body.citizen_id,
                    toBankCode: "004",
                    transType: "K2K",
                    typeOfSender: "K"
                }
            }

            const result = await RequestFunction.post(true, endpoint.default.kbank[this.#mode].verifyData, obj.headers, obj.body, { ssl: kbank.httpsAgent })

            console.log(`[${c_time()}] VerifyData request =>`)
            console.log(obj)

            console.log(`[${c_time()}] VerifyData response =>`)
            console.log(result.data)

            if (result.data.responseCode === '0000') {
                const verify_result = {
                    ACCOUNT_NAME: result.data.toAccNameTH,
                    ACCOUNT_NAME_EN: result.data.toAccNameEN,
                    CUSTOMER_MOBILE_NO: customerMobileNo,
                    REF_KBANK: result.data.merchantTransID,
                    CITIZEN_ID_ENC: result.data.senderTaxID,
                    BANK_ACCOUNT_ENC: result.data.proxyValue,
                    TRAN_ID: result.data.rsTransID,
                    RESULT: true
                }
                res.status(200).json(verify_result)
            } else {
                const verify_result = {
                    RESULT: false
                }
                res.status(200).json(verify_result)
            }

        } catch (error) {
            console.error(`[${c_time()}][${req.originalUrl}] Error => ${error}`)
            const send_res = {
                ResponseCode: "KBANKERR02",
                message: error,
                RESULT: false
            }
            res.status(500).json(send_res)
        }
    }

    /**
     * Withdraw tranfer
     * Last edit @date 10/16/2023 - 4:59:04 AM by Thadthep thadsri
     *
     * **/
    fundtransfer = async (req, res) => {
        const { exp, sigma_key, coop_key, amt_transfer, ...payload } = req.body
        const merchantID = payload.merchantTransID.match(/^([A-Z]+)_/)[1]
        try {
            if (await this.#session.getStatus(req.body.sigma_key, this.#bankNameInit)) throw "Unauthorized"
            const obj = {
                headers: {
                    "Authorization": `Bearer ${(await this.#session.getAuth(req.body.sigma_key, this.#bankNameInit))}`,
                    "Content-Type": "application/json",
                },
                body: {
                    customerMobileNo: payload.customerMobileNo,
                    merchantID: merchantID,
                    merchantTransID: payload.merchantTransID,
                    requestDateTime: moment().format('yyyy-MM-DDTHH:mm:ss.SSS+07:00'),
                    rsTransID: payload.rsTransID,
                    ref1: "",
                    ref2: ""
                }
            }

            const result = await RequestFunction.post(true, endpoint.default.kbank[this.#mode].fundTransfer, obj.headers, obj.body, { ssl: kbank.httpsAgent })

            if (result.data.responseCode === '0000') {
                const payload_verify_result = {
                    RESULT: true
                }

                const db_log_payload = {
                    log_income: req.body,
                    trans_flag: "-1",
                    coop_key: coop_key,
                    sigma_key: req.body.sigma_key,
                    log_response: result.data
                }

                await this.#service.transLog(db_log_payload)

                res.status(200).json(payload_verify_result)
            } else {
                obj.body = {
                    merchantID: merchantID,
                    merchantTransID: payload.merchantTransID,
                    requestDateTime: moment().format('yyyy-MM-DDTHH:mm:ss.SSS+07:00'),
                    rsTransID: payload.rsTransID
                }

                const Txn_result = await RequestFunction.post(true, endpoint.default.kbank[this.#mode].inqueryTxnStatus, obj.headers, obj.body, { ssl: kbank.httpsAgent })

                const payload_Txn_result = {
                    RESPONSE_CODE: Txn_result.data.responseCode,
                    RESPONSE_MESSAGE: Txn_result.data.responseMsg,
                    RESULT: false
                }

                const db_log_payload = {
                    log_income: req.body,
                    trans_flag: "-1",
                    coop_key: coop_key,
                    sigma_key: req.body.sigma_key,
                    log_response: Txn_result.data
                }

                await this.#service.transLog(db_log_payload)

                res.status(200).json(payload_Txn_result)
            }

            console.log(`[${c_time()}] Transfer request =>`)
            console.log(obj)

            console.log(`[${c_time()}] Transfer response =>`)
            console.log(result.data)

            //await token_session.DEL(req.body.unique_key,config_kbank_v2.bank_name)
            await this.#session.endSession(req.body.unique_key,this.#bankNameInit)

        } catch (error) {
            console.error(`[${c_time()}][${req.originalUrl}] Error => ${error}`)
            const send_res = {
                ResponseCode: "KTBERR02",
                message: error
            }
            if (error === 'Unauthorized') res.status(401).json(send_res)
            else res.status(400).json(send_res)
        }
    }
}