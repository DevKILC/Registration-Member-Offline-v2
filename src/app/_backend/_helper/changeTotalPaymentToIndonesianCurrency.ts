export const changeTotalPaymentToIndonesianCurrency = (totalPayment: number) => {
  if (typeof totalPayment !== "number") {
    totalPayment = 0;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalPayment);
};
