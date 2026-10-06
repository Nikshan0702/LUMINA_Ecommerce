export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return 'Rs. 0';
  return `Rs. ${Number(amount).toLocaleString('en-US')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatOrderId = (id) => {
  if (!id) return '';
  const clean = String(id);
  const suffix = clean.length >= 6 ? clean.slice(-6).toUpperCase() : clean.toUpperCase();
  return `#ORD-${suffix}`;
};

export const getOrderStatusBadge = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-[#EDE5F8] text-[#834FD4] border-[#DFCFF4]';
    case 'Shipped':
      return 'bg-[#EBF3EC] text-[#50805C] border-[#D1E6D4]';
    case 'Delivered':
      return 'bg-[#EBF3EC] text-[#50805C] border-[#D1E6D4]';
    case 'Cancelled':
      return 'bg-rose-50 text-[#E11D48] border-rose-200';
    default:
      return 'bg-[#FBEFE6] text-[#B86B3E] border-[#F5DAC7]'; // Pending
  }
};

export const getPaymentStatusBadge = (status) => {
  return status === 'Paid'
    ? 'bg-[#EBF3EC] text-[#50805C] border-[#D1E6D4]'
    : 'bg-[#FBEFE6] text-[#B86B3E] border-[#F5DAC7]';
};
