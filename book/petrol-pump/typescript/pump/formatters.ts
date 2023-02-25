class Formatters {
  public static priceFmt = new Intl.NumberFormat("en-us", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });
  public static formatPrice(price: number): string {
    const lcdSize = 4;
    const text = this.priceFmt.format(price);
    let i = 0;
    let digits = 0;
    while (true) {
      while (i < text.length && text[i] == ".") i++;
      if (digits == lcdSize) return text.substring(0, i);
      if (i >= text.length) break;
      digits++;
      i++;
    }
    return text;
  }

  public static costFmt = new Intl.NumberFormat("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  public static formatSaleCost(cost: number): string {
    return this.costFmt.format(cost);
  }

  public static quantityFmt = new Intl.NumberFormat("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  public static formatSaleQuantity(quantity: number): string {
    return this.quantityFmt.format(quantity);
  }
}

export default Formatters;
