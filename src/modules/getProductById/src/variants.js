module.exports = {
  get: function(skuModule) {
    const priceLists = skuModule.skuPriceList || [];
    const optionsLists = skuModule.productSKUPropertyList || [];

    const options = optionsLists.map(list => {
      return {
        id: list.skuPropertyId,
        name: list.skuPropertyName,
        values: list.skuPropertyValues ? list.skuPropertyValues.map(val => {
          return {
            id: val.propertyValueId,
            name: val.propertyValueName,
            displayName: val.propertyValueDisplayName,
            image: val.skuPropertyImagePath
          };
        }) : null
      };
    });

    const lists = priceLists.map(list => {
      return {
        skuId: list.skuId,
        optionValueIds: list.skuPropIds,
        availableQuantity: list.skuVal ? list.skuVal.availQuantity : null,
        originalPrice: list.skuVal && list.skuVal.skuAmount ? list.skuVal.skuAmount.value : null,
        salePrice: list.skuVal && list.skuVal.skuActivityAmount ? list.skuVal.skuActivityAmount.value : null
      };
    });

    return {
      options: options,
      prices: lists
    };
  }
};
