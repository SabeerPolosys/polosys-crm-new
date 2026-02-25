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

export function daysRemaining(expiryDate: string): any {
  const today = new Date();
  const expiry = new Date(expiryDate);

  // Remove time portion
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return <span className="text-red-500">Expired</span>;
  }

  if (diffDays === 0) {
    return <span className="text-blue-500">Expires Today</span>;
  }

  return <span className="text-green-500">{`${diffDays} Day${diffDays !== 1 ? "s" : ""} Remaining`}</span>;
}

export function formatDate(isoString) {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}