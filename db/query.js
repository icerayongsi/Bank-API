import { createPool } from "mysql2/promise"
import configs from '#constants/configs'

class DB_CONNECTION {
    static mysql = createPool({ ...configs[process.env.NODE_ENV].mysqlPool })
}

export class DB_KBANK {
    static GetPayerInfo = async (coop_key) => {
        try {
            const query = `SELECT merchant_id,payer_account,service_name FROM coop_provide_kbank WHERE coop_key = ?`
            const bind = [ coop_key ]
            const result = (await DB_CONNECTION.mysql.query(query, bind))[0]
            return result[0]
        } catch (error) {
            throw error
        }
    }

    static ResultLog = async (payload) => {
        try {
            const query = `INSERT INTO logtranskbank
            (
                log_income,
                trans_flag,
                coop_key,
                sigma_key,
                log_response
            ) VALUES ( ?, ?, ?, ?, ?)
            `
            const bind = [
                JSON.stringify(payload.log_income),
                payload.trans_flag,
                payload.coop_key,
                payload.sigma_key,
                JSON.stringify(payload.log_response)
            ]
            const result = await DB_CONNECTION.mysql.query(query, bind)
            return result
        } catch (error) {
            throw error
        }
    }
}

export class DB_CIMB {

    static GetBankProvide = async () => {
        try {
            const query = `SELECT 
            public_key,
            client_ref_id,
            client_id,
            channel_id,
            coop_key,
            secret_key,
            opay_encrypt_key64,
            opay_encrypt_iv64,
            x_apigw_api_id,
            bu_encode
            FROM coop_provide_cimb`
            const result = (await DB_CONNECTION.mysql.query(query))[0]
            return result
        } catch (error) {
            throw error
        }
    }

    static ResultLog = async (payload) => {
        try {
            const query = `INSERT INTO logtranscimb
            (
                log_income,
                trans_flag,
                coop_key,
                sigma_key,
                log_response
            ) VALUES ( ?, ?, ?, ?, ?)
            `
            const bind = [
                JSON.stringify(payload.log_income),
                payload.trans_flag,
                payload.coop_key,
                payload.sigma_key,
                JSON.stringify(payload.log_response)
            ]
            const result = await DB_CONNECTION.mysql.query(query, bind)
            return result
        } catch (error) {
            throw error
        }
    }
}
