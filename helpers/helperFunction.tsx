export const getBillingCycle = (val:number|string) => {
    switch(val){
      case 1:
      case "1":
        return "Monthly";
      case 3:
      case "3":
        return "Quarterly";
      case 6:
      case "6":
        return "Semi-Annually";
      case 12:
      case "12":
        return "Annually";
      case 24:
      case "24":
        return "Biennially";
      case 36:
      case "36":
        return "Triennially";
      default:
        return val;
    }
  }

  export function formatDateToDDMMYYYY(isoDateStr: Date): string {
  const date = new Date(isoDateStr);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatDateTime(isoString) {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

