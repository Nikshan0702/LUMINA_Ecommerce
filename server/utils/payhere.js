const crypto = require('crypto');

/**
 * Generate PayHere payment checkout hash
 * Formula: strtoupper(md5(merchant_id + order_id + amount + currency + strtoupper(md5(merchant_secret))))
 */
const generatePayHereHash = (orderId, amount, currency = 'LKR') => {
  const merchantId = process.env.PAYHERE_MERCHANT_ID || '1211149';
  const merchantSecret = process.env.PAYHERE_SECRET || '4MTg5MzIyNDMyMzExOTUxNDk1MTIzNDU2';

  // Format amount to 2 decimal places with no thousands separators (e.g. "1000.00")
  const formattedAmount = Number(amount).toLocaleString('en-us', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false
  });

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const mainString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;

  const finalHash = crypto
    .createHash('md5')
    .update(mainString)
    .digest('hex')
    .toUpperCase();

  return {
    merchantId,
    hash: finalHash,
    formattedAmount,
    currency
  };
};

module.exports = {
  generatePayHereHash
};
