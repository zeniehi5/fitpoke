export type { BaseTopping, MainTopping, Topping } from './toppingTypes';
export { baseToppings } from './baseToppings';
export { mainToppings } from './mainToppings';

import { baseToppings } from './baseToppings';
import { mainToppings } from './mainToppings';
import type { Topping } from './toppingTypes';

export const allToppings: Topping[] = [...baseToppings, ...mainToppings];