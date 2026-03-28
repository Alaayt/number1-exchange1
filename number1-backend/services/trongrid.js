// ============================================
// services/trongrid.js — التحقق من USDT
// ============================================

const axios = require('axios');

const TRONGRID_API = 'https://api.trongrid.io';
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // عقد USDT TRC20

// ─── التحقق من معاملة USDT ────────────────
exports.verifyUSDTTransaction = async ({ txHash, expectedAddress, expectedAmount }) => {
  try {
    const headers = {};
    if (process.env.TRONGRID_API_KEY) {
      headers['TRON-PRO-API-KEY'] = process.env.TRONGRID_API_KEY;
    }

    const response = await axios.get(
      `${TRONGRID_API}/v1/transactions/${txHash}`,
      { headers, timeout: 10000 }
    );

    const tx = response.data?.data?.[0];
    if (!tx) {
      return { success: false, message: 'Transaction not found on blockchain.' };
    }

    // التحقق من أن المعاملة ناجحة
    if (tx.ret?.[0]?.contractRet !== 'SUCCESS') {
      return { success: false, message: 'Transaction failed on blockchain.' };
    }

    // التحقق من أنها معاملة TRC20
    const contractData = tx.raw_data?.contract?.[0];
    if (contractData?.type !== 'TriggerSmartContract') {
      return { success: false, message: 'Not a TRC20 transaction.' };
    }

    // فك تشفير بيانات المعاملة
    const parameter = contractData?.parameter?.value;
    if (!parameter) {
      return { success: false, message: 'Cannot read transaction data.' };
    }

    // التحقق من العقد (USDT Contract)
    const contractAddress = parameter.contract_address;
    if (contractAddress !== USDT_CONTRACT) {
      return { success: false, message: 'Not a USDT transaction.' };
    }

    // استخراج المستقبل والمبلغ من الـ data
    const data = parameter.data;
    if (!data || data.length < 136) {
      return { success: false, message: 'Invalid transaction data.' };
    }

    // الـ data: a9059cbb (method) + address (32 bytes) + amount (32 bytes)
    const recipientHex = data.slice(32, 72);
    const amountHex = data.slice(72, 136);

    // تحويل العنوان
    const recipientAddress = hexToBase58(recipientHex);
    const amount = parseInt(amountHex, 16) / 1_000_000; // USDT لديه 6 decimals

    // ─── التحقق من العنوان ────────────────
    if (expectedAddress && recipientAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      return {
        success: false,
        message: `Wrong recipient. Expected: ${expectedAddress}, Got: ${recipientAddress}`
      };
    }

    // ─── التحقق من المبلغ (مع هامش 1%) ───
    if (expectedAmount) {
      const tolerance = expectedAmount * 0.01;
      if (amount < expectedAmount - tolerance) {
        return {
          success: false,
          message: `Amount too low. Expected: ${expectedAmount} USDT, Got: ${amount} USDT`
        };
      }
    }

    return {
      success: true,
      data: {
        txHash,
        recipientAddress,
        amount,
        timestamp: tx.block_timestamp
      }
    };

  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: 'Transaction not found. May not be confirmed yet.' };
    }
    console.error('TronGrid Error:', error.message);
    return { success: false, message: 'Error connecting to blockchain API.' };
  }
};

// ─── Helper: تحويل Hex إلى Base58 (TRON address) ─
function hexToBase58(hex) {
  // إضافة prefix 41 لعناوين Tron
  const fullHex = '41' + hex.slice(-40);
  // ملاحظة: تحويل كامل يحتاج مكتبة tronweb
  // هذا تحويل مبسط — في الإنتاج استخدم tronweb
  return 'T' + fullHex.slice(2, 6) + '...' + fullHex.slice(-4);
}

// ─── التحقق من رصيد محفظة ────────────────────
exports.getWalletBalance = async (address) => {
  try {
    const response = await axios.get(
      `${TRONGRID_API}/v1/accounts/${address}/transactions/trc20`,
      {
        params: { contract_address: USDT_CONTRACT, limit: 1 },
        timeout: 10000
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
