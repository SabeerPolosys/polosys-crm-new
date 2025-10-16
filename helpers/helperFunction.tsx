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