type getDeliveryDaysArgs = {
  deliveryDay: number;
};

export default function getDeliveryDays({ deliveryDay }: getDeliveryDaysArgs) {
  const today = new Date();
  const targetDay = new Date(today.setDate(today.getDate() + deliveryDay));

  return `${targetDay.getFullYear()}년 ${targetDay.getMonth()}월 ${targetDay.getDay()}일, ${
    ["일", "월", "화", "수", "목", "금", "토"][targetDay.getDay()]
  }요일`;
}
